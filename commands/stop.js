import config from '../config.js';
import logging from '../logger.js';
import { getChatJid } from '../utils/jidHelper.js';
const getNumberFromJid = (jid) => {
    return jid.split('@')[0].split(':')[0];
};

export default {
    name: 'stop',
    description: 'Stops the bot completely',
    usage: '.stop confirm',
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
        
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
        
        if (!text.toLowerCase().includes('confirm')) {
            await sock.sendMessage(jid.chat, { 
                text: `⚠️ *BOT SHUTDOWN WARNING*\n\nTo confirm: ${config.bot.preffix}stop confirm` 
            });
            return;
        }
        
        await sock.sendMessage(jid.chat, { 
            text: '🛑 *SHUTTING DOWN*\n\nGoodbye! 👋'
        });
        
        logging.fatal('Bot shutdown by owner');
        
        setTimeout(() => {
            process.exit(1);
        }, 2000);
    }
};