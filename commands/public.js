import config from '../config.js';
import logging from '../logger.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MODE_FILE = path.join(__dirname, '../data/botmode.json');

function loadBotMode() {
    try {
        if (fs.existsSync(MODE_FILE)) {
            const data = JSON.parse(fs.readFileSync(MODE_FILE, 'utf8'));
            return data.publicMode !== undefined ? data.publicMode : true;
        }
    } catch (error) {
        logging.error(`[PUBLIC] Load error: ${error.message}`);
    }
    return true; // Default to public mode
}

function saveBotMode(isPublic) {
    try {
        const dir = path.dirname(MODE_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.writeFileSync(MODE_FILE, JSON.stringify({ 
            publicMode: isPublic,
            lastChanged: new Date().toISOString()
        }, null, 2));
        
        return true;
    } catch (error) {
        logging.error(`[PUBLIC] Save error: ${error.message}`);
        return false;
    }
}

export default {
    name: 'public',
    aliases: ['mode', 'private'],
    description: 'Toggle bot between public and private mode',
    usage: '.public <on/off>',
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

        const currentMode = loadBotMode();

        // If no argument, show current status
        if (args.length === 0) {
            const statusText = `🤖 *Bot Mode Status*\n\n` +
                `📊 *Current Mode:* ${currentMode ? '🌍 Public' : '🔒 Private'}\n\n` +
                `${currentMode ? 
                    '✅ Bot responds to all messages' : 
                    '🔐 Bot only responds to owner messages'}\n\n` +
                `*Usage:*\n` +
                `• ${config.bot.preffix}public on - Enable public mode\n` +
                `• ${config.bot.preffix}public off - Enable private mode`;
            
            return await sock.sendMessage(sender, {
                text: statusText
            }, { quoted: message });
        }

        const action = args[0].toLowerCase();

        if (action === 'on') {
            if (currentMode) {
                return await sock.sendMessage(sender, {
                    text: '⚠️ *Already Active*\n\nBot is already in public mode.'
                }, { quoted: message });
            }

            if (saveBotMode(true)) {
                logging.success('[PUBLIC] Switched to PUBLIC mode');
                
                await sock.sendMessage(sender, {
                    text: '🌍 *Public Mode Enabled*\n\n✅ Bot will now respond to all messages.\n\n_Mode changed successfully!_'
                }, { quoted: message });
            } else {
                await sock.sendMessage(sender, {
                    text: '❌ *Error*\n\nFailed to save mode settings.'
                }, { quoted: message });
            }

        } else if (action === 'off') {
            if (!currentMode) {
                return await sock.sendMessage(sender, {
                    text: '⚠️ *Already Active*\n\nBot is already in private mode.'
                }, { quoted: message });
            }

            if (saveBotMode(false)) {
                logging.success('[PUBLIC] Switched to PRIVATE mode');
                
                await sock.sendMessage(sender, {
                    text: '🔒 *Private Mode Enabled*\n\n✅ Bot will now only respond to your messages.\n\n_Mode changed successfully!_'
                }, { quoted: message });
            } else {
                await sock.sendMessage(sender, {
                    text: '❌ *Error*\n\nFailed to save mode settings.'
                }, { quoted: message });
            }

        } else {
            await sock.sendMessage(sender, {
                text: `❌ *Invalid Option*\n\n*Usage:*\n• ${config.bot.preffix}public on\n• ${config.bot.preffix}public off\n• ${config.bot.preffix}public (check status)`
            }, { quoted: message });
        }
    }
};

// Export helper function to check mode
export function isPublicMode() {
    return loadBotMode();
}