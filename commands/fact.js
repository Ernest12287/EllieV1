import config from '../config.js';
import logging from '../logger.js';
import { getChatJid } from '../utils/jidHelper.js';
export default {
    name: 'fact',
    aliases: ['facts', 'randomfact'],
    description: 'Get random interesting facts',
    usage: '.fact',
    category: 'Fun',
    
    async execute(sock, message, args) {
        const jid = getChatJid(message);
        
        try {
            await sock.sendMessage(jid.chat, { 
                text: '🧠 Fetching fact...' 
            });

            const apiUrl = 'https://uselessfacts.jsph.pl/random.json?language=en';
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data && data.text) {
                const factText = `╭━━━『 🧠 DID YOU KNOW? 』\n┃\n┃ ${data.text}\n┃\n╰━━━━━━━━━━━━━━━⬣\n\n💡 Random Fact\n_${config.bot.name}_`;
                
                await sock.sendMessage(jid.chat, { text: factText });
                logging.success(`[FACT] Sent random fact`);
            } else {
                await sock.sendMessage(jid.chat, { 
                    text: '❌ Could not fetch fact. Try again!' 
                });
            }

        } catch (error) {
            logging.error(`[FACT] Error: ${error.message}`);
            await sock.sendMessage(jid.chat, { 
                text: '❌ Failed to fetch fact.' 
            });
        }
    }
};