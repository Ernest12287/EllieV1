import makeWASocket, { 
    useMultiFileAuthState, 
    DisconnectReason, 
    fetchLatestBaileysVersion,
    Browsers,
    makeCacheableSignalKeyStore
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import QRCode from 'qrcode';
import logger from './logger.js';
import { loadCommands } from './utils/commandloader.js';
import handleMessages from './Handlers/messagehandler.js';
import config from './config.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MODIFIED: Function to handle creds.json file authentication
async function getAuthState() {
    if (config.auth.useCredsFile) {
        logger.info('Using creds.json file for authentication...');
        
        const credsPath = path.resolve(__dirname, config.auth.credsFilePath);
        
        if (!fs.existsSync(credsPath)) {
            logger.error(`Creds file not found at: ${credsPath}`);
            throw new Error('creds.json file not found. Please place it in the root directory.');
        }

        // Create auth folder if it doesn't exist
        const authFolder = path.resolve(__dirname, config.auth.folder);
        if (!fs.existsSync(authFolder)) {
            fs.mkdirSync(authFolder, { recursive: true });
        }

        // Copy creds.json to auth folder
        const destPath = path.join(authFolder, 'creds.json');
        if (!fs.existsSync(destPath)) {
            fs.copyFileSync(credsPath, destPath);
            logger.success('Creds file copied to auth folder');
        }

        // Use the auth folder with the creds.json file
        return await useMultiFileAuthState(authFolder);
    } else {
        // Use standard folder-based authentication
        logger.info('Using folder-based authentication...');
        return await useMultiFileAuthState(config.auth.folder);
    }
}

async function sendWelcomeMessage(sock, commands) {
    try {
        const userNumber = `${config.user.number}@s.whatsapp.net`;
        const commandCount = commands.size;
        
        const welcomeText = `Hello *${config.user.name}*! 👋\n\n` +
            `Thank you for connecting with *${config.bot.name}* WhatsApp Bot! 🤖\n\n` +
            `📊 *Bot Statistics:*\n` +
            `• Total Commands: *${commandCount}*\n` +
            `• Version: *${config.bot.version}*\n` +
            `• Prefix: *${config.bot.preffix}*\n` +
            `• Auth Method: *${config.auth.useCredsFile ? 'Creds File' : 'Folder'}*\n\n` +
            `⚠️ *Note:* This bot is connected using Ernest Tech House Session Generator.\n` +
            `All commands are working fully and reliably! ✅\n\n` +
            `🔗 *Connect With Us:*\n` +
            `• Telegram Group: ${config.social.telegram}\n` +
            `• WhatsApp Channel: ${config.social.whatsappChannel}\n\n` +
            `📞 *Need Help?*\n` +
            `Contact the owner for features, bugs, or issues.\n\n` +
            `👤 *Owner:* ${config.creator.name}\n` +
            `📱 *Contact:* wa.me/${config.creator.number}\n` +
            `📧 *Email:* ${config.creator.email}\n\n` +
            `Type *${config.bot.preffix}help* to see all available commands!\n\n` +
            `_Thank you for using ${config.bot.name}!_ 💚`;

        if (fs.existsSync(config.bot.welcomeImage)) {
            const imageBuffer = fs.readFileSync(config.bot.welcomeImage);
            
            await sock.sendMessage(userNumber, {
                image: imageBuffer,
                caption: welcomeText,
                contextInfo: {
                    externalAdReply: {
                        title: `${config.bot.name} - Connected Successfully! ✅`,
                        body: `${commandCount} Commands Available`,
                        thumbnailUrl: '',
                        sourceUrl: config.social.telegram,
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            });
            
            logger.success(`Welcome message with image sent to ${config.user.name}`);
        } else {
            await sock.sendMessage(userNumber, {
                text: welcomeText,
                contextInfo: {
                    externalAdReply: {
                        title: `${config.bot.name} - Connected Successfully! ✅`,
                        body: `${commandCount} Commands Available`,
                        sourceUrl: config.social.telegram,
                        mediaType: 1
                    }
                }
            });
            
            logger.warn(`Welcome image not found at ${config.bot.welcomeImage}, sent text-only message`);
        }
        
    } catch (error) {
        logger.error(`Failed to send welcome message: ${error.message}`);
    }
}

async function connectToWhatsApp() {
    try {
        // MODIFIED: Get auth state based on configuration
        const { state, saveCreds } = await getAuthState();
        const { version } = await fetchLatestBaileysVersion();
        logger.info(`Connecting with @whiskeysockets/baileys version: ${version.join('.')}`);

        const sock = makeWASocket({
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, logger),
            },
            logger: logger,
            version: version,
            browser: Browsers.macOS('Desktop'),
            printQRInTerminal: false,
        });

        sock.ev.on('creds.update', saveCreds);

        sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect, qr } = update;

            if (qr) {
                console.log('\n╔═══════════════════════════════════════╗');
                console.log('║  SCAN THIS QR CODE TO LOG IN          ║');
                console.log('╚═══════════════════════════════════════╝\n');
                console.log(await QRCode.toString(qr, { type: 'terminal', small: true }));
                console.log('\n═══════════════════════════════════════\n');
            }

            if (connection === 'close') {
                const statusCode = (lastDisconnect?.error instanceof Boom) 
                    ? lastDisconnect.error.output.statusCode 
                    : 500;
                
                logger.error(`Connection closed. Status Code: ${statusCode}`);
                const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
                
                if (shouldReconnect) {
                    logger.warn(`Attempting to reconnect...`);
                    setTimeout(() => connectToWhatsApp(), 5000);
                } else {
                    logger.fatal('Logged out. Session terminated.');
                    if (config.auth.useCredsFile) {
                        logger.info('Please get a new creds.json file from Ernest Session Generator');
                        logger.info('Visit: https://ernest-session.onrender.com/');
                    }
                }
            } else if (connection === 'open') {
                logger.success('╔═══════════════════════════════════════════╗');
                logger.success('║   CONNECTION TO WHATSAPP ESTABLISHED! ✅   ║');
                logger.success('╚═══════════════════════════════════════════╝');
                
                logger.info('Loading commands...');
                const commands = await loadCommands();
                logger.success(`Loaded ${commands.size} command(s): ${[...commands.keys()].join(', ')}`);
                
                sock.commands = commands;
                
                await sendWelcomeMessage(sock, commands);
            }
        });
        
        sock.ev.on('messages.upsert', async (m) => {
            const message = m.messages[0];
            if (!message) return;
            
            const commands = sock.commands || new Map();
            await handleMessages(sock, message, commands);
        });

    } catch (error) {
        logger.error(`Failed to connect: ${error.message}`);
        if (error.message.includes('creds.json')) {
            logger.info('Please visit Ernest Session Generator to get creds.json');
            logger.info('URL: https://ernest-session.onrender.com/');
        }
        process.exit(1);
    }
}

connectToWhatsApp();