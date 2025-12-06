import config from '../config.js';
import logging from '../logger.js';
import { downloadMediaMessage } from 'baileys';
import sharp from 'sharp';
import { getChatJid } from '../utils/jidHelper.js';
export default {
    name: 'toimage',
    aliases: ['toimg', 'image'],
    description: 'Convert sticker to image using the sharp library (no external binaries like ffmpeg required)',
    usage: '.toimage <reply to sticker>',
    category: 'Convert',
    
    async execute(sock, message, args) {
        const jid = getChatJid(message);
        
        try {
            // Check if message is a reply to a sticker or contains a sticker
            const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            const stickerMessage = quotedMessage?.stickerMessage || message.message?.stickerMessage;
            
            if (!stickerMessage) {
                await sock.sendMessage(jid.chat, { 
                    text: '❌ *No Sticker Found*\n\nPlease reply to a sticker with this command.\n\nUsage: `' + config.bot.preffix + 'toimage` (reply to sticker)' 
                });
                return;
            }
            
            await sock.sendMessage(jid.chat, { 
                text: '⏳ *Converting to Image...*\n\nUsing sharp. Please wait...' 
            });
            
            // Determine the message object to download from
            const downloadTarget = quotedMessage?.stickerMessage ? 
                { key: message.key, message: quotedMessage } : 
                message;
                
            // Download the sticker media as a WebP Buffer
            const buffer = await downloadMediaMessage(downloadTarget, 'buffer', {});

            // ⭐️ CONVERSION USING SHARP ⭐️
            let imageBuffer;
            try {
                // Use sharp to convert the WebP buffer to a PNG buffer
                imageBuffer = await sharp(buffer)
                    .png() // Convert to PNG format
                    .toBuffer();
                    
            } catch (sharpError) {
                // If sharp fails (e.g., corrupted file, or installation issue)
                logging.error('[TOIMAGE] Sharp conversion failed:', sharpError);
                throw new Error('Conversion failed using sharp. Error details: ' + sharpError.message);
            }
            
            // Send the converted image
            await sock.sendMessage(jid.chat, {
                image: imageBuffer,
                caption: '✅ *Converted to Image!*\n\n🖼️ Sticker successfully converted using sharp.'
            });
            
            logging.success(`[TOIMAGE] Converted sticker to image for ${sender} using sharp`);
            
        } catch (error) {
            logging.error(`[TOIMAGE] Error: ${error.message}`);
            
            let errorMsg = '❌ *Failed to Convert Sticker*\n\n';
            errorMsg += 'Error: ' + error.message;
            
            if (error.message.includes('sharp')) {
                 errorMsg += '\n\n*Troubleshooting:* Ensure the `sharp` package is installed correctly in your environment.';
            }

            await sock.sendMessage(jid.chat, { text: errorMsg });
        }
    }
};