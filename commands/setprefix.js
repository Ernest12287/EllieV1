import config from '../config.js';
import logging from '../logger.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getChatJid } from '../utils/jidHelper.js';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ENV_PATH = path.join(__dirname, '../.env');

const getNumberFromJid = (jid) => {
    return jid.split('@')[0].split(':')[0];
};

export default {
    name: 'setprefix',
    description: 'Change bot prefix',
    usage: '.setprefix <new>',
    category: 'Admin',
    adminOnly: true,
    
    async execute(sock, message, args) {
        const jid = getChatJid(message);
        const ownerNumber = config.creator.number;
        
        const senderCleanNumber = getNumberFromJid(sender);
        if (ownerNumber !== senderCleanNumber) {
            await sock.sendMessage(jid.chat, { text: config.error.notadmin });
            return;
        }
        
        if (args.length === 0) {
            await sock.sendMessage(jid.chat, { 
                text: `❌ Provide new prefix.\n\nCurrent: *${config.bot.preffix}*\n\nUsage: ${config.bot.preffix}setprefix <new>` 
            });
            return;
        }
        
        const newPrefix = args[0];
        
        if (newPrefix.includes(' ')) {
            await sock.sendMessage(jid.chat, { text: '❌ Prefix cannot contain spaces!' });
            return;
        }
        
        if (newPrefix.length > 3) {
            await sock.sendMessage(jid.chat, { text: '❌ Max 3 characters!' });
            return;
        }
        
        try {
            const oldPrefix = config.bot.preffix;
            config.bot.preffix = newPrefix;
            
            if (fs.existsSync(ENV_PATH)) {
                let envContent = fs.readFileSync(ENV_PATH, 'utf8');
                
                if (envContent.includes('PREFFIX=')) {
                    envContent = envContent.replace(/PREFFIX=.*/g, `PREFFIX=${newPrefix}`);
                } else {
                    envContent += `\nPREFFIX=${newPrefix}`;
                }
                
                fs.writeFileSync(ENV_PATH, envContent);
                logging.success(`Prefix changed: ${oldPrefix} → ${newPrefix}`);
            }
            
            await sock.sendMessage(jid.chat, { 
                text: `✅ *Prefix Updated!*\n\nOld: *${oldPrefix}*\nNew: *${newPrefix}*\n\n⚠️ Restart bot to persist.` 
            });
            
        } catch (error) {
            logging.error(`Error: ${error.message}`);
            await sock.sendMessage(jid.chat, { text: '❌ Failed to update prefix.' });
        }
    }
};