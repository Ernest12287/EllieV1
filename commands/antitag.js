import config from '../config.js';
import logging from '../logger.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getChatJid } from '../utils/jidHelper.js';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ANTITAG_DB = path.join(__dirname, '../data/antitag.json');

function loadSettings() {
    try {
        if (fs.existsSync(ANTITAG_DB)) {
            return JSON.parse(fs.readFileSync(ANTITAG_DB, 'utf8'));
        }
    } catch (error) {
        return {};
    }
    return {};
}

function saveSettings(settings) {
    try {
        const dir = path.dirname(ANTITAG_DB);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(ANTITAG_DB, JSON.stringify(settings, null, 2));
    } catch (error) {
        logging.error(`[ANTITAG] Save error`);
    }
}

export default {
    name: 'antitag',
    description: 'Anti mass tag protection',
    usage: '.antitag on|off|setlimit <number>',
    category: 'Group',
    
    async execute(sock, message, args) {
        const jid = getChatJid(message);
        
        if (!sender.endsWith('@g.us')) {
            await sock.sendMessage(jid.chat, { text: config.error.notingroups });
            return;
        }
        
        try {
            const groupMetadata = await sock.groupMetadata(sender);
            const participants = groupMetadata.participants;
            
            const senderIsAdmin = participants.find(p => 
                p.id === message.key.participant && (p.admin === 'admin' || p.admin === 'superadmin')
            );
            
            if (!senderIsAdmin) {
                await sock.sendMessage(jid.chat, { text: config.error.notadmin });
                return;
            }
            
            const settings = loadSettings();
            
            if (!settings[sender]) {
                settings[sender] = { enabled: false, limit: 5 };
            }
            
            if (args.length === 0) {
                const status = settings[sender].enabled ? 'ON ✅' : 'OFF ❌';
                await sock.sendMessage(jid.chat, { 
                    text: `🛡️ *ANTITAG*\n\nStatus: ${status}\nLimit: ${settings[sender].limit} people\n\nCommands:\n• ${config.bot.preffix}antitag on\n• ${config.bot.preffix}antitag off\n• ${config.bot.preffix}antitag setlimit <number>` 
                });
                return;
            }
            
            const action = args[0].toLowerCase();
            
            if (action === 'on') {
                settings[sender].enabled = true;
                saveSettings(settings);
                
                await sock.sendMessage(jid.chat, { 
                    text: `✅ *Antitag Enabled*\n\n🛡️ Messages tagging >${settings[sender].limit} people will be deleted` 
                });
                
            } else if (action === 'off') {
                settings[sender].enabled = false;
                saveSettings(settings);
                
                await sock.sendMessage(jid.chat, { 
                    text: `❌ *Antitag Disabled*` 
                });
                
            } else if (action === 'setlimit') {
                if (args.length < 2) {
                    await sock.sendMessage(jid.chat, { 
                        text: `❌ Specify number\n\nUsage: ${config.bot.preffix}antitag setlimit 10` 
                    });
                    return;
                }
                
                const limit = parseInt(args[1]);
                
                if (isNaN(limit) || limit < 1 || limit > 100) {
                    await sock.sendMessage(jid.chat, { 
                        text: '❌ Number must be 1-100' 
                    });
                    return;
                }
                
                settings[sender].limit = limit;
                saveSettings(settings);
                
                await sock.sendMessage(jid.chat, { 
                    text: `✅ *Limit Updated*\n\nNew: ${limit} people` 
                });
                
            } else {
                await sock.sendMessage(jid.chat, { 
                    text: `❌ Invalid. Use: on, off, setlimit` 
                });
            }
            
        } catch (error) {
            logging.error(`[ANTITAG] Error: ${error.message}`);
            await sock.sendMessage(jid.chat, { text: '❌ Failed.' });
        }
    }
};