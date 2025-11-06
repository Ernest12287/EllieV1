import makeWASocket, { 
    useMultiFileAuthState, 
    DisconnectReason, 
    fetchLatestBaileysVersion,
    Browsers,
    makeCacheableSignalKeyStore
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import logger from './logger.js';
import { loadCommands } from './utils/commandloader.js';
import handleMessages from './Handlers/messagehandler.js';
import config from './config.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to decode base64 session to creds.json
async function decodeBase64Session(base64String, targetPath) {
    try {
        // Decode base64 to UTF-8 JSON string
        const decodedString = Buffer.from(base64String, 'base64').toString('utf8');
        
        // Verify it's valid JSON
        const jsonData = JSON.parse(decodedString);
        
        // Write to file
        fs.writeFileSync(targetPath, JSON.stringify(jsonData, null, 2), 'utf8');
        
        logger.success('Session decoded and saved successfully');
        return true;
    } catch (error) {
        logger.error(`Failed to decode session: ${error.message}`);
        return false;
    }
}

// MODIFIED: Function to handle creds.json file authentication
async function getAuthState() {
    if (config.auth.useCredsFile) {
        logger.info('Using creds.json file for authentication...');
        
        const credsPath = path.resolve(__dirname, config.auth.credsFilePath);
        
        // Check if creds.json exists
        if (!fs.existsSync(credsPath)) {
            logger.error(`Creds file not found at: ${credsPath}`);
            
            // Check if there's a base64 session in environment variable
            if (process.env.SESSION_ID) {
                logger.info('Found SESSION_ID in environment, attempting to decode...');
                
                const decoded = await decodeBase64Session(process.env.SESSION_ID, credsPath);
                
                if (!decoded) {
                    throw new Error('Failed to decode SESSION_ID. Please check the session string.');
                }
                
                logger.success('Session decoded from SESSION_ID');
            } else {
                throw new Error('creds.json not found and no SESSION_ID provided. Please get a session from Ernest Session Generator.');
            }
        }

        // Verify the creds.json is valid JSON
        try {
            const credsContent = fs.readFileSync(credsPath, 'utf8');
            JSON.parse(credsContent);
            logger.success('Creds file is valid JSON');
        } catch (parseError) {
            logger.error('Creds file is corrupted or invalid JSON');
            
            // Try to decode from SESSION_ID if available
            if (process.env.SESSION_ID) {
                logger.info('Attempting to restore from SESSION_ID...');
                const decoded = await decodeBase64Session(process.env.SESSION_ID, credsPath);
                
                if (!decoded) {
                    throw new Error('creds.json is invalid and SESSION_ID decode failed');
                }
            } else {
                throw new Error('creds.json is corrupted. Please get a new session.');
            }
        }

        // Create auth folder if it doesn't exist
        const authFolder = path.resolve(__dirname, config.auth.folder);
        if (!fs.existsSync(authFolder)) {
            fs.mkdirSync(authFolder, { recursive: true });
        }

        // Copy creds.json to auth folder
        const destPath = path.join(authFolder, 'creds.json');
        if (!fs.existsSync(destPath) || fs.readFileSync(credsPath, 'utf8') !== fs.readFileSync(destPath, 'utf8')) {
            fs.copyFileSync(credsPath, destPath);
            logger.success('Creds file copied to auth folder');
        }

        // Use the auth folder with the creds.json file
        return await useMultiFileAuthState(authFolder);
    } else {
        // Use standard folder-based authentication (QR code method - DISABLED)
        logger.warn('QR code method is deprecated. Please use SESSION_ID method.');
        logger.info('To use SESSION_ID: Set USE_CREDS_FILE=true and add SESSION_ID to .env');
        
        // Still allow it but warn user
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
            `• Auth Method: *${config.auth.useCredsFile ? 'Session ID' : 'Folder'}*\n\n` +
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
        // Get auth state based on configuration
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
            printQRInTerminal: false, // QR code disabled
        });

        sock.ev.on('creds.update', saveCreds);

        sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect } = update;

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
                    logger.info('Please get a new session from Ernest Session Generator');
                    logger.info('Visit: https://ernest-session.onrender.com/');
                    logger.info('Or set SESSION_ID in your .env file');
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
        
        if (error.message.includes('creds.json') || error.message.includes('SESSION_ID')) {
            logger.info('╔═══════════════════════════════════════════╗');
            logger.info('║     HOW TO GET YOUR SESSION ID            ║');
            logger.info('╚═══════════════════════════════════════════╝');
            logger.info('1. Visit: https://ernest-tech-house-sessiongenerator.onrender.com/pair');
            logger.info('2. Choose Pairing Code or QR Code method');
            logger.info('3. You will receive a base64 session string');
            logger.info('4. Add to .env: SESSION_ID="your_base64_string"');
            logger.info('5. Set: USE_CREDS_FILE=true');
            logger.info('6. Run: npm start');
        }
        
        process.exit(1);
    }
}

connectToWhatsApp();