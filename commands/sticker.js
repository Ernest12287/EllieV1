import config from '../config.js';
import logging from '../logger.js';
import { downloadMediaMessage } from 'baileys';
import { Sticker } from 'wa-sticker-formatter';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getChatJid } from '../utils/jidHelper.js';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMP_DIR = path.join(__dirname, '../temp');

// Ensure temp directory exists
if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
}

export default {
    name: 'sticker',
    aliases: ['s', 'stiker'],
    description: 'Convert image/video to sticker',
    usage: '.sticker <reply to image/video> or .sticker <pack> <author>',
    category: 'Convert',
    
    async execute(sock, message, args) {
        const jid = getChatJid(message);
        
        try {
            // Check if message is a reply to an image/video or contains an image/video
            const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            const imageMessage = quotedMessage?.imageMessage || message.message?.imageMessage;
            const videoMessage = quotedMessage?.videoMessage || message.message?.videoMessage;
            
            if (!imageMessage && !videoMessage) {
                await sock.sendMessage(jid.chat, { 
                    text: '❌ *No Media Found*\n\nPlease reply to an image or video (max 10s) with this command.\n\nUsage:\n• `' + config.bot.preffix + 'sticker` (reply to media)\n• `' + config.bot.preffix + 'sticker <pack> <author>`' 
                });
                return;
            }
            
            await sock.sendMessage(jid.chat, { 
                text: '⏳ *Creating Sticker...*\n\nPlease wait...' 
            });
            
            // Download the media
            let buffer;
            if (quotedMessage?.imageMessage || quotedMessage?.videoMessage) {
                const tempMsg = {
                    key: message.key,
                    message: quotedMessage
                };
                buffer = await downloadMediaMessage(tempMsg, 'buffer', {});
            } else {
                buffer = await downloadMediaMessage(message, 'buffer', {});
            }
            
            // Get pack and author names from args or use defaults
            const pack = args[0] || config.bot.name;
            const author = args[1] || config.creator.name;
            
            // Create sticker
            const sticker = new Sticker(buffer, {
                pack: pack,
                author: author,
                type: 'default', // 'default' | 'crop' | 'full'
                quality: 50,
                background: 'transparent'
            });
            
            const stickerBuffer = await sticker.toBuffer();
            
            // Send sticker
            await sock.sendMessage(jid.chat, {
                sticker: stickerBuffer
            });
            
            logging.success(`[STICKER] Created sticker for ${sender}`);
            
        } catch (error) {
            logging.error(`[STICKER] Error: ${error.message}`);
            
            let errorMsg = '❌ *Failed to Create Sticker*\n\n';
            
            if (error.message.includes('duration')) {
                errorMsg += 'Video is too long. Please use videos under 10 seconds.';
            } else if (error.message.includes('size')) {
                errorMsg += 'File is too large. Please use smaller files.';
            } else {
                errorMsg += 'Error: ' + error.message;
            }
            
            await sock.sendMessage(jid.chat, { text: errorMsg });
        }
    }
};