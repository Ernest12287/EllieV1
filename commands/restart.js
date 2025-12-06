import config from '../config.js';
import logging from '../logger.js';
import { getChatJid } from '../utils/jidHelper.js';
const getNumberFromJid = (jid) => {
    return jid.split('@')[0].split(':')[0];
};

export default {
    name: 'restart',
    description: 'Restarts the bot process',
    usage: '.restart',
    category: 'Admin',
    adminOnly: true,
    
    async execute(sock, message) {
        const jid = getChatJid(message);
        const ownerNumber = config.creator.number;
        
        const senderCleanNumber = getNumberFromJid(sender);
        if (ownerNumber !== senderCleanNumber) {
            await sock.sendMessage(jid.chat, { text: config.error.notadmin });
            return;
        }
        
        await sock.sendMessage(jid.chat, { 
            text: '🔄 Restarting bot...\n\nPlease wait.' 
        });
        
        logging.warn('Bot restart initiated by owner');
        
        setTimeout(() => {
            process.exit(0);
        }, 1000);
    }
};