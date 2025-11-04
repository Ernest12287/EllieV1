import config from '../config.js';
import logging from '../logger.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ANTITAG_DB = path.join(__dirname, '../data/antitag.json');
const ANTIWORD_DB = path.join(__dirname, '../data/antiword.json');

function loadAntitagSettings() {
    try {
        if (fs.existsSync(ANTITAG_DB)) {
            return JSON.parse(fs.readFileSync(ANTITAG_DB, 'utf8'));
        }
    } catch (error) {
        logging.error(`[ANTITAG] Load error: ${error.message}`);
        return {};
    }
    return {};
}

function loadAntiwordSettings() {
    try {
        if (fs.existsSync(ANTIWORD_DB)) {
            return JSON.parse(fs.readFileSync(ANTIWORD_DB, 'utf8'));
        }
    } catch (error) {
        logging.error(`[ANTIWORD] Load error: ${error.message}`);
        return {};
    }
    return {};
}

async function checkAntitag(sock, message, sender) {
    if (!sender.endsWith('@g.us')) return false;
    
    try {
        const settings = loadAntitagSettings();
        
        if (!settings[sender] || !settings[sender].enabled) {
            return false;
        }
        
        const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        
        if (mentionedJid.length > settings[sender].limit) {
            logging.warn(`[ANTITAG] Detected mass tag (${mentionedJid.length} people) in group`);
            
            try {
                // Check if bot is admin before attempting to delete
                const groupMetadata = await sock.groupMetadata(sender);
                const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';
                const botParticipant = groupMetadata.participants.find(p => p.id === botNumber);
                const botIsAdmin = botParticipant && (botParticipant.admin === 'admin' || botParticipant.admin === 'superadmin');
                
                if (!botIsAdmin) {
                    logging.warn('[ANTITAG] Bot is not admin, cannot delete message');
                    const senderNumber = message.key.participant.split('@')[0];
                    await sock.sendMessage(sender, { 
                        text: `⚠️ *Mass Tag Detected*\n\n👤 @${senderNumber} tagged ${mentionedJid.length} people\n📊 Limit: ${settings[sender].limit}\n\n❌ Cannot delete: Bot needs admin rights\n\n_Please make the bot admin to enforce antitag._`,
                        mentions: [message.key.participant]
                    });
                    return false;
                }
                
                await sock.sendMessage(sender, { 
                    delete: message.key 
                });
                
                const senderNumber = message.key.participant.split('@')[0];
                const warningText = `⚠️ *Mass Tag Detected & Deleted*\n\n👤 @${senderNumber}\n🚫 Your message was deleted for tagging ${mentionedJid.length} people\n📊 Limit: ${settings[sender].limit} people\n\n_Please avoid mass tagging._`;
                
                await sock.sendMessage(sender, { 
                    text: warningText,
                    mentions: [message.key.participant]
                });
                
                logging.success(`[ANTITAG] Deleted mass tag message from ${senderNumber}`);
                return true;
                
            } catch (error) {
                logging.error(`[ANTITAG] Failed to delete message: ${error.message}`);
                
                await sock.sendMessage(sender, { 
                    text: `⚠️ *Antitag Alert*\n\nDetected mass tag (${mentionedJid.length} people) but couldn't delete.\n\n🔧 Make sure the bot is admin to enforce antitag protection.` 
                });
            }
        }
        
    } catch (error) {
        logging.error(`[ANTITAG] Error checking: ${error.message}`);
    }
    
    return false;
}

async function checkAntiword(sock, message, sender, text) {
    if (!sender.endsWith('@g.us')) return false;
    if (!text || text.trim() === '') return false;
    
    try {
        const settings = loadAntiwordSettings();
        
        if (!settings[sender] || !settings[sender].enabled || !settings[sender].words || settings[sender].words.length === 0) {
            return false;
        }
        
        const lowerText = text.toLowerCase();
        const foundWord = settings[sender].words.find(word => lowerText.includes(word.toLowerCase()));
        
        if (foundWord) {
            logging.warn(`[ANTIWORD] Detected banned word "${foundWord}" in group`);
            
            try {
                // Check if bot is admin before attempting to delete
                const groupMetadata = await sock.groupMetadata(sender);
                const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';
                const botParticipant = groupMetadata.participants.find(p => p.id === botNumber);
                const botIsAdmin = botParticipant && (botParticipant.admin === 'admin' || botParticipant.admin === 'superadmin');
                
                if (!botIsAdmin) {
                    logging.warn('[ANTIWORD] Bot is not admin, cannot delete message');
                    const senderNumber = message.key.participant.split('@')[0];
                    await sock.sendMessage(sender, { 
                        text: `🚫 *Banned Word Detected*\n\n👤 @${senderNumber} used a banned word\n\n❌ Cannot delete: Bot needs admin rights\n\n_Please make the bot admin to enforce antiword._`,
                        mentions: [message.key.participant]
                    });
                    return false;
                }
                
                await sock.sendMessage(sender, { 
                    delete: message.key 
                });
                
                const senderNumber = message.key.participant.split('@')[0];
                const warningText = `🚫 *Banned Word Detected & Deleted*\n\n👤 @${senderNumber}\n⚠️ Your message contained a banned word\n\n_Please follow group rules._`;
                
                await sock.sendMessage(sender, { 
                    text: warningText,
                    mentions: [message.key.participant]
                });
                
                logging.success(`[ANTIWORD] Deleted message with banned word from ${senderNumber}`);
                return true;
                
            } catch (error) {
                logging.error(`[ANTIWORD] Failed to delete message: ${error.message}`);
                
                await sock.sendMessage(sender, { 
                    text: `⚠️ *Antiword Alert*\n\nDetected banned word but couldn't delete.\n\n🔧 Make sure the bot is admin to enforce antiword protection.` 
                });
            }
        }
        
    } catch (error) {
        logging.error(`[ANTIWORD] Error checking: ${error.message}`);
    }
    
    return false;
}

export default async function normalMessageHandler(sock, message, commands) {
    if (!commands || !(commands instanceof Map)) {
        logging.error('Commands map is not passed correctly to normalMessageHandler!');
        return;
    }
    
    const sender = message.key.remoteJid;
    const messageContent = message.message; 
    const prefix = config.bot.preffix;
    
    const text = messageContent?.conversation || 
                 messageContent?.extendedTextMessage?.text || 
                 '';

    // Check antitag first (for mass mentions)
    const wasDeletedByAntitag = await checkAntitag(sock, message, sender);
    if (wasDeletedByAntitag) {
        return; // Stop processing if message was deleted
    }

    // Check antiword (for banned words)
    const wasDeletedByAntiword = await checkAntiword(sock, message, sender, text);
    if (wasDeletedByAntiword) {
        return; // Stop processing if message was deleted
    }

    // Process commands
    if (text.startsWith(prefix)) {
        const fullCommand = text.slice(prefix.length).trim();
        const [commandName, ...args] = fullCommand.split(/\s+/);

        const command = commands.get(commandName.toLowerCase());

        if (command) {
            try {
                logging.info(`[COMMAND] Executing '${commandName}' from ${sender}`);
                
                await command.execute(sock, message, args, commands);
            } catch (error) {
                logging.error(`Error executing command ${commandName}: ${error.message}`);
                console.error('Full error:', error);
                await sock.sendMessage(sender, { 
                    text: "❌ An error occurred while running that command. Please check the logs." 
                });
            }
        } else {
            await sock.sendMessage(sender, { 
                text: `Command *${prefix}${commandName}* not found. Type ${prefix}help for available commands.` 
            });
        }
        return;
    }

    // Log media messages
    if (messageContent?.imageMessage) {
        logging.info(`[IMAGE] Received image from ${sender}`);
    }
    if (messageContent?.videoMessage) {
        logging.info(`[VIDEO] Received video from ${sender}`);
    }
    if (messageContent?.audioMessage) {
        logging.info(`[AUDIO] Received audio from ${sender}`);
    }
    if (messageContent?.documentMessage) {
        logging.info(`[DOCUMENT] Received document from ${sender}`);
    }
}