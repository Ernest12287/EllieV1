import config from '../config.js';
import logging from '../logger.js';
import { getChatJid } from '../utils/jidHelper.js';
export default {
    name: 'ebase',
    aliases: ['encodebase64', 'base64encode'],
    description: 'Encode text to Base64',
    usage: '.ebase <text>',
    category: 'Utility',
    
    async execute(sock, message, args) {
        const jid = getChatJid(message);
        
        if (args.length < 1) {
            await sock.sendMessage(jid.chat, { 
                text: `╭━━━『 🔐 BASE64 ENCODE 』\n┃\n┃ ❌ Usage: ${config.bot.preffix}ebase <text>\n┃\n┃ 💡 Example:\n┃ ${config.bot.preffix}ebase Hello World\n┃\n╰━━━━━━━━━━━━━━━⬣`
            });
        }

        try {
            await sock.sendMessage(jid.chat, { 
                text: '🔐 Encoding...' 
            });

            const text = args.join(' ');
            const apiUrl = `https://api.giftedtech.co.ke/api/tools/ebase?apikey=gifted&query=${encodeURIComponent(text)}`;
            
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.success && data.result) {
                const resultText = `╭━━━『 🔐 BASE64 ENCODED 』\n┃\n┃ 📝 Original:\n┃ ${text}\n┃\n┃━━━━━━━━━━━━━━\n┃\n┃ 🔒 Encoded:\n┃ ${data.result}\n┃\n╰━━━━━━━━━━━━━━━⬣\n\n_${config.bot.name}_`;
                
                await sock.sendMessage(jid.chat, { text: resultText });
                logging.success(`[EBASE] Text encoded`);
            } else {
                await sock.sendMessage(jid.chat, { 
                    text: '❌ Failed to encode text!' 
                });
            }

        } catch (error) {
            logging.error(`[EBASE] Error: ${error.message}`);
            await sock.sendMessage(jid.chat, { 
                text: `❌ Error encoding text!` 
            });
        }
    }
};