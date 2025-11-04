import config from '../config.js';
import logging from '../logger.js';
import { downloadMediaMessage } from '@whiskeysockets/baileys';
import { Jimp } from 'jimp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMP_DIR = path.join(__dirname, '../temp');

// Ensure temp directory exists
if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
}

export default {
    name: 'fullpp',
    description: 'Set bot profile picture (full image, no crop) - Owner only',
    usage: '.fullpp <reply to image>',
    category: 'Owner',
    
    async execute(sock, message, args) {
        const sender = message.key.remoteJid;
        const senderNumber = message.key.participant || message.key.remoteJid;
        const senderJid = senderNumber.split('@')[0];
        
        // Check if sender is the owner
        if (senderJid !== config.user.number) {
            await sock.sendMessage(sender, { 
                text: `❌ *Access Denied*\n\nThis command is only available to the bot owner.\n\n👤 Owner: ${config.user.name}\n📱 Number: ${config.user.number}` 
            });
            logging.warn(`[FULLPP] Unauthorized access attempt by ${senderJid}`);
            return;
        }
        
        try {
            // Check if message is a reply to an image or contains an image
            const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            const imageMessage = quotedMessage?.imageMessage || message.message?.imageMessage;
            
            if (!imageMessage) {
                await sock.sendMessage(sender, { 
                    text: '❌ *No Image Found*\n\nPlease reply to an image or send an image with the command.\n\nUsage: `' + config.bot.preffix + 'fullpp` (reply to image)' 
                });
                return;
            }
            
            await sock.sendMessage(sender, { 
                text: '⏳ *Processing...*\n\nDownloading and preparing image...' 
            });
            
            // Download the image
            let buffer;
            if (quotedMessage?.imageMessage) {
                // Create a temporary message object for the quoted image
                const tempMsg = {
                    key: message.key,
                    message: { imageMessage: quotedMessage.imageMessage }
                };
                buffer = await downloadMediaMessage(tempMsg, 'buffer', {});
            } else {
                buffer = await downloadMediaMessage(message, 'buffer', {});
            }
            
            // Save original image temporarily
            const tempPath = path.join(TEMP_DIR, `fullpp_temp_${Date.now()}.jpg`);
            fs.writeFileSync(tempPath, buffer);
            
            // Load image with Jimp (just to ensure it's valid and optimize if needed)
            const image = await Jimp.read(tempPath);
            
            // Resize to optimal size for WhatsApp profile picture if too large
            // WhatsApp accepts up to 640x640, so we maintain aspect ratio
            const maxDimension = 640;
            if (image.bitmap.width > maxDimension || image.bitmap.height > maxDimension) {
                if (image.bitmap.width > image.bitmap.height) {
                    await image.resize({ w: maxDimension });
                } else {
                    await image.resize({ h: maxDimension });
                }
            }
            
            // Save processed image
            const processedPath = path.join(TEMP_DIR, `fullpp_processed_${Date.now()}.jpg`);
            await image.write(processedPath);
            
            // Read the processed image
            const processedBuffer = fs.readFileSync(processedPath);
            
            // Set profile picture
            await sock.updateProfilePicture(sock.user.id, processedBuffer);
            
            // Clean up temp files
            try {
                fs.unlinkSync(tempPath);
                fs.unlinkSync(processedPath);
            } catch (cleanupError) {
                logging.warn(`[FULLPP] Cleanup warning: ${cleanupError.message}`);
            }
            
            await sock.sendMessage(sender, { 
                text: '✅ *Profile Picture Updated!*\n\n🖼️ Full image set as bot profile picture (no cropping).' 
            });
            
            logging.success(`[FULLPP] Profile picture updated by ${senderJid}`);
            
        } catch (error) {
            logging.error(`[FULLPP] Error: ${error.message}`);
            console.error('Full FULLPP error:', error);
            await sock.sendMessage(sender, { 
                text: '❌ *Failed to Update Profile Picture*\n\nError: ' + error.message 
            });
        }
    }
};