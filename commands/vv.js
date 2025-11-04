import config from '../config.js';
import logging from '../logger.js';
import { downloadContentFromMessage } from '@whiskeysockets/baileys';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
    name: 'vv',
    description: 'Download view-once images/videos',
    usage: '.vv (reply to view-once)',
    category: 'Tools',
    
    async execute(sock, message) {
        const sender = message.key.remoteJid;
        
        try {
            const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            
            if (!quoted) {
                await sock.sendMessage(sender, { 
                    text: `❌ Reply to a view-once message.\n\nUsage: ${config.bot.preffix}vv (reply)`
                }, { quoted: message });
                return;
            }
            
            let mediaToDownload = null;
            let mediaType = null;
            
            if (quoted.imageMessage) {
                mediaToDownload = quoted.imageMessage;
                mediaType = 'image';
            } else if (quoted.videoMessage) {
                mediaToDownload = quoted.videoMessage;
                mediaType = 'video';
            } else if (quoted.viewOnceMessageV2) {
                const content = quoted.viewOnceMessageV2.message;
                if (content?.imageMessage) {
                    mediaToDownload = content.imageMessage;
                    mediaType = 'image';
                } else if (content?.videoMessage) {
                    mediaToDownload = content.videoMessage;
                    mediaType = 'video';
                }
            } else if (quoted.viewOnceMessage) {
                const content = quoted.viewOnceMessage.message;
                if (content?.imageMessage) {
                    mediaToDownload = content.imageMessage;
                    mediaType = 'image';
                } else if (content?.videoMessage) {
                    mediaToDownload = content.videoMessage;
                    mediaType = 'video';
                }
            }
            
            if (!mediaToDownload || !mediaType) {
                await sock.sendMessage(sender, { 
                    text: '❌ No view-once media found.'
                }, { quoted: message });
                return;
            }
            
            await sock.sendMessage(sender, { 
                text: `⏳ Downloading view-once ${mediaType}...` 
            });
            
            logging.info(`[VV] Downloading ${mediaType}`);
            
            const stream = await downloadContentFromMessage(mediaToDownload, mediaType);
            let buffer = Buffer.from([]);
            
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }
            
            if (buffer.length === 0) {
                await sock.sendMessage(sender, { 
                    text: '❌ Failed to download. File might be expired.'
                }, { quoted: message });
                return;
            }
            
            const tempDir = path.join(__dirname, '../temp');
            await fs.mkdir(tempDir, { recursive: true });
            
            const ext = mediaType === 'image' ? 'jpg' : 'mp4';
            const filename = `viewonce_${Date.now()}.${ext}`;
            const filePath = path.join(tempDir, filename);
            
            await fs.writeFile(filePath, buffer);
            
            const caption = mediaType === 'image' 
                ? `📸 *View-Once Image*\n\n_Downloaded by ${config.bot.name}_`
                : `🎥 *View-Once Video*\n\n_Downloaded by ${config.bot.name}_`;
            
            if (mediaType === 'image') {
                await sock.sendMessage(sender, { 
                    image: { url: filePath }, 
                    caption: caption 
                }, { quoted: message });
            } else {
                await sock.sendMessage(sender, { 
                    video: { url: filePath }, 
                    caption: caption 
                }, { quoted: message });
            }
            
            await fs.unlink(filePath);
            logging.success(`[VV] Downloaded successfully`);
            
        } catch (error) {
            logging.error(`[VV] Error: ${error.message}`);
            await sock.sendMessage(sender, { 
                text: '❌ Failed to download view-once media.'
            }, { quoted: message });
        }
    }
};