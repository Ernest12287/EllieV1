import config from '../config.js';
import logging from '../logger.js';
import { getChatJid } from '../utils/jidHelper.js';
export default {
    name: 'fancy',
    aliases: ['style', 'fancytext'],
    description: 'Convert text to fancy styled text',
    usage: '.fancy <text>',
    category: 'Utility',
    
    async execute(sock, message, args) {
        const jid = getChatJid(message);
        
        if (args.length < 1) {
            await sock.sendMessage(jid.chat, { 
                text: `╭━━━『 ✨ FANCY TEXT 』\n┃\n┃ ❌ Usage: ${config.bot.preffix}fancy <text>\n┃\n┃ 💡 Example:\n┃ ${config.bot.preffix}fancy Hello World\n┃\n╰━━━━━━━━━━━━━━━⬣`
            });
        }

        try {
            await sock.sendMessage(jid.chat, { 
                text: '✨ Creating fancy text...' 
            });

            const text = args.join(' ');
            const apiUrl = `https://api.giftedtech.co.ke/api/tools/fancy?apikey=gifted&text=${encodeURIComponent(text)}`;
            
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.success && data.results && data.results.length > 0) {
                let resultText = `╭━━━『 ✨ FANCY TEXT 』\n┃\n┃ 📝 Original: ${text}\n┃\n┃━━━━━━━━━━━━━━\n┃\n`;
                
                // Show first 15 styles to avoid too long message
                data.results.slice(0, 15).forEach((style, index) => {
                    resultText += `┃ ${index + 1}. ${style.result}\n`;
                });
                
                if (data.results.length > 15) {
                    resultText += `┃ ... and ${data.results.length - 15} more styles\n`;
                }
                
                resultText += `┃\n╰━━━━━━━━━━━━━━━⬣\n\n_${config.bot.name}_`;
                
                await sock.sendMessage(jid.chat, { text: resultText });
                logging.success(`[FANCY] Styled text created`);
            } else {
                await sock.sendMessage(jid.chat, { 
                    text: '❌ Failed to create fancy text!' 
                });
            }

        } catch (error) {
            logging.error(`[FANCY] Error: ${error.message}`);
            await sock.sendMessage(jid.chat, { 
                text: `❌ Error creating fancy text!` 
            });
        }
    }
};