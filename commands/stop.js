import config from '../config.js';
import logging from '../logger.js';

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
        const sender = message.key.remoteJid;
        const ownerNumber = config.creator.number;
        
        const senderCleanNumber = getNumberFromJid(sender);
        if (ownerNumber !== senderCleanNumber) {
            await sock.sendMessage(sender, { text: config.error.notadmin });
            return;
        }
        
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
        
        if (!text.toLowerCase().includes('confirm')) {
            await sock.sendMessage(sender, { 
                text: `⚠️ *BOT SHUTDOWN WARNING*\n\nTo confirm: ${config.bot.preffix}stop confirm` 
            });
            return;
        }
        
        await sock.sendMessage(sender, { 
            text: '🛑 *SHUTTING DOWN*\n\nGoodbye! 👋'
        });
        
        logging.fatal('Bot shutdown by owner');
        
        setTimeout(() => {
            process.exit(1);
        }, 2000);
    }
};