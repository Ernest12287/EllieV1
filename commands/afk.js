import config from '../config.js';
import logging from '../logger.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const AFK_DB = path.join(__dirname, '../data/afk.json');

function loadAFKData() {
    try {
        if (fs.existsSync(AFK_DB)) {
            return JSON.parse(fs.readFileSync(AFK_DB, 'utf8'));
        }
    } catch (error) {
        logging.error(`[AFK] Load error: ${error.message}`);
    }
    return {};
}

function saveAFKData(data) {
    try {
        const dir = path.dirname(AFK_DB);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(AFK_DB, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        logging.error(`[AFK] Save error: ${error.message}`);
        return false;
    }
}

export default {
    name: 'afk',
    aliases: ['away'],
    description: 'Set yourself as AFK (Away From Keyboard)',
    usage: '.afk [reason]',
    category: 'Personal',
    
    async execute(sock, message, args) {
        const sender = message.key.remoteJid;
        const userJid = message.key.participant || message.key.remoteJid;
        const userNumber = userJid.split('@')[0];
        
        const afkData = loadAFKData();
        
        // Check if user is currently AFK
        if (afkData[userJid] && afkData[userJid].isAFK) {
            // Turn OFF AFK
            delete afkData[userJid];
            saveAFKData(afkData);
            
            logging.success(`[AFK] ${userNumber} is no longer AFK`);
            
            await sock.sendMessage(sender, {
                text: `✅ *AFK Mode Disabled*\n\n` +
                      `Welcome back! You are no longer AFK.\n\n` +
                      `_AFK mode has been turned off._`
            }, { quoted: message });
            
            return;
        }
        
        // Turn ON AFK
        const reason = args.length > 0 ? args.join(' ') : 'No reason provided';
        const timestamp = Date.now();
        
        afkData[userJid] = {
            isAFK: true,
            reason: reason,
            time: timestamp,
            mentions: 0
        };
        
        if (saveAFKData(afkData)) {
            logging.success(`[AFK] ${userNumber} is now AFK: ${reason}`);
            
            let afkText = `💤 *AFK Mode Activated*\n\n`;
            afkText += `👤 *User:* @${userNumber}\n`;
            afkText += `📝 *Reason:* ${reason}\n`;
            afkText += `⏰ *Time:* ${new Date(timestamp).toLocaleTimeString()}\n\n`;
            afkText += `_I will auto-reply to anyone who mentions you._\n`;
            afkText += `_Send any message to disable AFK mode._`;
            
            await sock.sendMessage(sender, {
                text: afkText,
                mentions: [userJid]
            }, { quoted: message });
        } else {
            await sock.sendMessage(sender, {
                text: '❌ Failed to enable AFK mode. Please try again.'
            }, { quoted: message });
        }
    }
};

// Export helper functions for use in message handler
export function getAFKData() {
    return loadAFKData();
}

export function removeAFK(userJid) {
    const afkData = loadAFKData();
    if (afkData[userJid]) {
        delete afkData[userJid];
        return saveAFKData(afkData);
    }
    return false;
}

export function incrementMentions(userJid) {
    const afkData = loadAFKData();
    if (afkData[userJid]) {
        afkData[userJid].mentions = (afkData[userJid].mentions || 0) + 1;
        saveAFKData(afkData);
    }
}

export function isUserAFK(userJid) {
    const afkData = loadAFKData();
    return afkData[userJid] ? afkData[userJid] : null;
}