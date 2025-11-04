import config from '../config.js';
import logging from '../logger.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ANTIWORD_DB = path.join(__dirname, '../data/antiword.json');

function loadSettings() {
    try {
        if (fs.existsSync(ANTIWORD_DB)) {
            return JSON.parse(fs.readFileSync(ANTIWORD_DB, 'utf8'));
        }
    } catch (error) {
        return {};
    }
    return {};
}

function saveSettings(settings) {
    try {
        const dir = path.dirname(ANTIWORD_DB);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(ANTIWORD_DB, JSON.stringify(settings, null, 2));
    } catch (error) {
        logging.error(`[ANTIWORD] Save error`);
    }
}

export default {
    name: 'antiword',
    description: 'Manage banned words',
    usage: '.antiword add|remove|list <word>',
    category: 'Group',
    
    async execute(sock, message, args) {
        const sender = message.key.remoteJid;
        
        if (!sender.endsWith('@g.us')) {
            await sock.sendMessage(sender, { text: config.error.notingroups });
            return;
        }
        
        try {
            const groupMetadata = await sock.groupMetadata(sender);
            const participants = groupMetadata.participants;
            
            const senderIsAdmin = participants.find(p => 
                p.id === message.key.participant && (p.admin === 'admin' || p.admin === 'superadmin')
            );
            
            if (!senderIsAdmin) {
                await sock.sendMessage(sender, { text: config.error.notadmin });
                return;
            }
            
            const settings = loadSettings();
            if (!settings[sender]) {
                settings[sender] = { enabled: true, words: [] };
            }
            
            if (args.length === 0) {
                await sock.sendMessage(sender, { 
                    text: `Usage:\n• ${config.bot.preffix}antiword add <word>\n• ${config.bot.preffix}antiword remove <word>\n• ${config.bot.preffix}antiword list` 
                });
                return;
            }
            
            const action = args[0].toLowerCase();
            
            if (action === 'add') {
                if (args.length < 2) {
                    await sock.sendMessage(sender, { text: '❌ Specify a word.' });
                    return;
                }
                
                const word = args.slice(1).join(' ').toLowerCase();
                
                if (!settings[sender].words.includes(word)) {
                    settings[sender].words.push(word);
                    saveSettings(settings);
                    
                    await sock.sendMessage(sender, { 
                        text: `✅ Added "${word}" to banned list` 
                    });
                } else {
                    await sock.sendMessage(sender, { text: `⚠️ Already banned.` });
                }
                
            } else if (action === 'remove') {
                if (args.length < 2) {
                    await sock.sendMessage(sender, { text: '❌ Specify a word.' });
                    return;
                }
                
                const word = args.slice(1).join(' ').toLowerCase();
                const index = settings[sender].words.indexOf(word);
                
                if (index > -1) {
                    settings[sender].words.splice(index, 1);
                    saveSettings(settings);
                    
                    await sock.sendMessage(sender, { 
                        text: `✅ Removed "${word}"` 
                    });
                } else {
                    await sock.sendMessage(sender, { text: `⚠️ Not in list.` });
                }
                
            } else if (action === 'list') {
                const words = settings[sender]?.words || [];
                
                if (words.length === 0) {
                    await sock.sendMessage(sender, { text: '📋 No banned words.' });
                } else {
                    let text = `╔═══════════════════╗\n`;
                    text += `║ 🚫 *BANNED WORDS* ║\n`;
                    text += `╚═══════════════════╝\n\n`;
                    
                    words.forEach((word, i) => {
                        text += `${i + 1}. ${word}\n`;
                    });
                    
                    text += `\n📊 Total: ${words.length}`;
                    
                    await sock.sendMessage(sender, { text });
                }
                
            } else {
                await sock.sendMessage(sender, { 
                    text: `❌ Invalid action. Use: add, remove, list` 
                });
            }
            
        } catch (error) {
            logging.error(`[ANTIWORD] Error: ${error.message}`);
            await sock.sendMessage(sender, { text: '❌ Failed.' });
        }
    }
};