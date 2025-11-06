import config from '../config.js';
import logging from '../logger.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
    name: 'session',
    aliases: ['decode', 'creds'],
    description: 'Decode base64 session to creds.json',
    usage: '.session <base64-string>',
    category: 'Owner',
    
    async execute(sock, message, args) {
        const sender = message.key.remoteJid;
        
        // SECURITY: Only bot owner can use this
        const ownerNumber = config.user.number.replace(/[^0-9]/g, '');
        const senderNumber = sender.replace(/[^0-9]/g, '');
        
        if (senderNumber !== ownerNumber) {
            return await sock.sendMessage(sender, {
                text: '❌ *Access Denied*\n\nThis command is restricted to the bot owner only.'
            }, { quoted: message });
        }

        // Check if base64 string is provided
        if (args.length === 0) {
            const helpText = `📋 *Session Decoder*\n\n` +
                `*Usage:*\n` +
                `${config.bot.preffix}session <base64-string>\n\n` +
                `*Or reply to a message containing the session ID*\n\n` +
                `*Example:*\n` +
                `${config.bot.preffix}session eyJub2lzZUtleS....\n\n` +
                `*What this does:*\n` +
                `• Decodes your base64 session\n` +
                `• Creates creds.json file\n` +
                `• Saves to bot directory\n` +
                `• Ready to use immediately\n\n` +
                `Get your session from:\n` +
                `https://ernest-tech-house-sessiongenerator.onrender.com/pair`;
            
            return await sock.sendMessage(sender, {
                text: helpText
            }, { quoted: message });
        }

        // Get base64 string from args or quoted message
        let base64String = args.join(' ');
        
        // Check if replying to a message
        const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        if (quotedMessage && !base64String) {
            base64String = quotedMessage.conversation || quotedMessage.extendedTextMessage?.text || '';
        }

        if (!base64String || base64String.trim() === '') {
            return await sock.sendMessage(sender, {
                text: '❌ *No Session ID Provided*\n\nPlease provide a base64 session string or reply to a message containing it.'
            }, { quoted: message });
        }

        await sock.sendMessage(sender, {
            text: '⏳ *Decoding Session...*\n\nPlease wait while I process your session ID.'
        }, { quoted: message });

        try {
            // Decode base64 to UTF-8 JSON string
            const decodedString = Buffer.from(base64String.trim(), 'base64').toString('utf8');
            
            // Verify it's valid JSON
            let jsonData;
            try {
                jsonData = JSON.parse(decodedString);
            } catch (jsonError) {
                throw new Error('Invalid session format. The decoded data is not valid JSON.');
            }

            // Verify it has required fields for WhatsApp creds
            if (!jsonData.noiseKey || !jsonData.signedIdentityKey || !jsonData.signedPreKey) {
                throw new Error('Invalid session structure. Missing required WhatsApp credentials fields.');
            }

            // Save to creds.json
            const credsPath = path.join(__dirname, '..', 'creds.json');
            fs.writeFileSync(credsPath, JSON.stringify(jsonData, null, 2), 'utf8');
            
            // Also save to auth folder
            const authFolder = path.join(__dirname, '..', config.auth.folder);
            if (!fs.existsSync(authFolder)) {
                fs.mkdirSync(authFolder, { recursive: true });
            }
            
            const authCredsPath = path.join(authFolder, 'creds.json');
            fs.writeFileSync(authCredsPath, JSON.stringify(jsonData, null, 2), 'utf8');
            
            logging.success('[SESSION] Session decoded and saved successfully');

            const successText = `✅ *Session Decoded Successfully!*\n\n` +
                `📁 *Files Created:*\n` +
                `• creds.json (root directory)\n` +
                `• ${config.auth.folder}/creds.json (auth folder)\n\n` +
                `📊 *Session Info:*\n` +
                `• Account ID: ${jsonData.me?.id || 'Unknown'}\n` +
                `• Registration ID: ${jsonData.registrationId || 'Unknown'}\n\n` +
                `⚙️ *Next Steps:*\n` +
                `1. Update .env file:\n` +
                `   USE_CREDS_FILE=true\n\n` +
                `2. Restart the bot:\n` +
                `   ${config.bot.preffix}restart\n\n` +
                `✅ Your bot is now ready to use this session!`;

            await sock.sendMessage(sender, {
                text: successText
            }, { quoted: message });

        } catch (error) {
            logging.error(`[SESSION] Decode error: ${error.message}`);

            let errorText = `❌ *Session Decode Failed*\n\n`;
            
            if (error.message.includes('Invalid character')) {
                errorText += `*Error:* Invalid base64 string\n\n` +
                    `*Possible causes:*\n` +
                    `• String was copied incorrectly\n` +
                    `• Extra spaces or characters\n` +
                    `• Incomplete session string\n\n` +
                    `*Solution:*\n` +
                    `Make sure to copy the entire session string from WhatsApp.`;
            } else if (error.message.includes('JSON')) {
                errorText += `*Error:* ${error.message}\n\n` +
                    `*This session appears to be corrupted.*\n\n` +
                    `*Solution:*\n` +
                    `Please generate a new session from:\n` +
                    `https://ernest-tech-house-sessiongenerator.onrender.com/pair`;
            } else if (error.message.includes('required')) {
                errorText += `*Error:* ${error.message}\n\n` +
                    `*This doesn't look like a valid WhatsApp session.*\n\n` +
                    `*Solution:*\n` +
                    `Make sure you're using a session generated from Ernest Session Generator.`;
            } else {
                errorText += `*Error:* ${error.message}\n\n` +
                    `*Technical Details:*\n` +
                    `Session length: ${base64String.length} characters\n\n` +
                    `For support, contact:\n` +
                    `${config.creator.email}`;
            }

            await sock.sendMessage(sender, {
                text: errorText
            }, { quoted: message });
        }
    }
};