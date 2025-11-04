import config from '../config.js';
import logging from '../logger.js';

export default {
    name: 'advice',
    aliases: ['tip', 'wisdom'],
    description: 'Get random life advice',
    usage: '.advice',
    category: 'Fun',
    
    async execute(sock, message, args) {
        const sender = message.key.remoteJid;
        
        try {
            await sock.sendMessage(sender, { 
                text: '💡 Getting advice...' 
            });

            const apiUrl = 'https://api.adviceslip.com/advice';
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data && data.slip && data.slip.advice) {
                const adviceText = `╭━━━『 💡 ADVICE 』\n┃\n┃ ${data.slip.advice}\n┃\n╰━━━━━━━━━━━━━━━⬣\n\n🎯 Advice #${data.slip.id}\n_${config.bot.name}_`;
                
                await sock.sendMessage(sender, { text: adviceText });
                logging.success(`[ADVICE] Sent advice #${data.slip.id}`);
            } else {
                await sock.sendMessage(sender, { 
                    text: '❌ Could not fetch advice. Try again!' 
                });
            }

        } catch (error) {
            logging.error(`[ADVICE] Error: ${error.message}`);
            await sock.sendMessage(sender, { 
                text: '❌ Failed to fetch advice.' 
            });
        }
    }
};