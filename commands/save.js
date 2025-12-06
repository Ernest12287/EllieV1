import { downloadMediaMessage } from 'baileys';
import config from '../config.js';
import logging from '../logger.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getChatJid } from '../utils/jidHelper.js';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
    name: 'save',
    description: 'Download and save status content',
    usage: '.save (reply to status)',
    category: 'Status',
    
    async execute(sock, message, args) {
        const jid = getChatJid(message);
        const userJid = `${config.user.number}@s.whatsapp.net`;
        
        // Check if this is a reply to a status
        const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const quotedKey = message.message?.extendedTextMessage?.contextInfo?.stanzaId;
        
        if (!quotedMessage) {
            await sock.sendMessage(jid.chat, { 
                text: `💾 *Status Saver*\n\n❌ Please reply to a status message with .save\n\n_This command only works when replying to status updates._`
            });
        }

        try {
            await sock.sendMessage(userJid, { 
                text: '⏳ Downloading status content...' 
            });

            logging.info('[SAVE] Downloading status content');

            const tempDir = path.join(__dirname, '../temp');
            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir, { recursive: true });
            }

            // Determine message type
            let mediaType = null;
            let caption = '';

            if (quotedMessage.imageMessage) {
                mediaType = 'image';
                caption = quotedMessage.imageMessage.caption || '';
            } else if (quotedMessage.videoMessage) {
                mediaType = 'video';
                caption = quotedMessage.videoMessage.caption || '';
            } else if (quotedMessage.conversation || quotedMessage.extendedTextMessage) {
                mediaType = 'text';
                caption = quotedMessage.conversation || quotedMessage.extendedTextMessage?.text || '';
            } else if (quotedMessage.audioMessage) {
                mediaType = 'audio';
            }

            if (mediaType === 'text') {
                // Send text status
                await sock.sendMessage(userJid, { 
                    text: `📝 *Saved Status*\n\n${caption}\n\n_Status saved by ${config.bot.name}_`
                });
            } else if (mediaType && mediaType !== 'text') {
                // Download media
                const buffer = await downloadMediaMessage(
                    { key: message.message.extendedTextMessage.contextInfo, message: quotedMessage },
                    'buffer',
                    {}
                );

                const timestamp = Date.now();
                const filename = `status_${timestamp}`;
                
                // Send based on media type
                if (mediaType === 'image') {
                    await sock.sendMessage(userJid, {
                        image: buffer,
                        caption: `📸 *Saved Status Image*${caption ? `\n\n${caption}` : ''}\n\n_Downloaded by ${config.bot.name}_`
                    });
                } else if (mediaType === 'video') {
                    await sock.sendMessage(userJid, {
                        video: buffer,
                        caption: `🎥 *Saved Status Video*${caption ? `\n\n${caption}` : ''}\n\n_Downloaded by ${config.bot.name}_`,
                        mimetype: 'video/mp4'
                    });
                } else if (mediaType === 'audio') {
                    await sock.sendMessage(userJid, {
                        audio: buffer,
                        mimetype: 'audio/mp4',
                        ptt: false
                    });
                    await sock.sendMessage(userJid, { 
                        text: `🎵 *Saved Status Audio*\n\n_Downloaded by ${config.bot.name}_`
                    });
                }

                logging.success(`[SAVE] Status content saved successfully`);
            } else {
                await sock.sendMessage(userJid, { 
                    text: `❌ Unsupported status type. Only images, videos, audio, and text are supported.`
                });
            }

        } catch (error) {
            logging.error(`[SAVE] Error: ${error.message}`);
            await sock.sendMessage(userJid, { 
                text: `❌ Failed to save status.\n\n*Error:* ${error.message}`
            });
        }
    }
};