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
    name: 'pp',
    description: 'Set bot profile picture (cropped to square) - Owner only',
    usage: '.pp <reply to image>',
    category: 'Owner',
    
    async execute(sock, message, args) {
        const sender = message.key.remoteJid;
        const senderNumber = message.key.participant || message.key.remoteJid;
        const senderJid = senderNumber.split('@')[0]; // Extract just the number
        
        // Check if sender is the owner - FIXED: Use config.user.number
        if (senderJid !== config.user.number) {
            await sock.sendMessage(sender, { 
                text: `❌ *Access Denied*\n\nThis command is only available to the bot owner.\n\n👤 Owner: ${config.user.name}\n📱 Number: ${config.user.number}` 
            });
            logging.warn(`[PP] Unauthorized access attempt by ${senderJid}`);
            return;
        }
        
        try {
            // Check if message is a reply to an image or contains an image
            const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            const imageMessage = quotedMessage?.imageMessage || message.message?.imageMessage;
            
            if (!imageMessage) {
                await sock.sendMessage(sender, { 
                    text: '❌ *No Image Found*\n\nPlease reply to an image or send an image with the command.\n\nUsage: `' + config.bot.preffix + 'pp` (reply to image)' 
                });
                return;
            }
            
            await sock.sendMessage(sender, { 
                text: '⏳ *Processing...*\n\nDownloading and cropping image...' 
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
            const tempPath = path.join(TEMP_DIR, `pp_temp_${Date.now()}.jpg`);
            fs.writeFileSync(tempPath, buffer);
            
            // Load image with Jimp
            const image = await Jimp.read(tempPath);
            
            // Get dimensions
            const width = image.bitmap.width;
            const height = image.bitmap.height;
            
            // Crop to square (center crop)
            const size = Math.min(width, height);
            const x = (width - size) / 2;
            const y = (height - size) / 2;
            
            image.crop({ x, y, w: size, h: size });
            
            // Resize to optimal size for WhatsApp profile picture (640x640)
            image.resize({ w: 640, h: 640 });
            
            // Save cropped image
            const croppedPath = path.join(TEMP_DIR, `pp_cropped_${Date.now()}.jpg`);
            await image.write(croppedPath);
            
            // Read the cropped image
            const croppedBuffer = fs.readFileSync(croppedPath);
            
            // Set profile picture
            await sock.updateProfilePicture(sock.user.id, croppedBuffer);
            
            // Clean up temp files
            try {
                fs.unlinkSync(tempPath);
                fs.unlinkSync(croppedPath);
            } catch (cleanupError) {
                logging.warn(`[PP] Cleanup warning: ${cleanupError.message}`);
            }
            
            await sock.sendMessage(sender, { 
                text: '✅ *Profile Picture Updated!*\n\n🖼️ Image cropped to square and set as bot profile picture.' 
            });
            
            logging.success(`[PP] Profile picture updated by ${senderJid}`);
            
        } catch (error) {
            logging.error(`[PP] Error: ${error.message}`);
            console.error('Full PP error:', error);
            await sock.sendMessage(sender, { 
                text: '❌ *Failed to Update Profile Picture*\n\nError: ' + error.message 
            });
        }
    }
};