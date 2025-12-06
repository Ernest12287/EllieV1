import config from '../config.js';
import logging from '../logger.js';
import { getChatJid } from '../utils/jidHelper.js';
export default {
    name: 'dbinary',
    aliases: ['decodebinary', 'frombinary'],
    description: 'Decode binary to text',
    usage: '.dbinary <binary>',
    category: 'Utility',
    
    async execute(sock, message, args) {
        const jid = getChatJid(message);
        
        if (args.length < 1) {
            await sock.sendMessage(jid.chat, { 
                text: `╭━━━『 💾 BINARY DECODE 』\n┃\n┃ ❌ Usage: ${config.bot.preffix}dbinary <binary>\n┃\n┃ 💡 Example:\n┃ ${config.bot.preffix}dbinary 01001000 01101001\n┃\n╰━━━━━━━━━━━━━━━⬣`
            });
        }

        try {
            await sock.sendMessage(jid.chat, { 
                text: '💾 Decoding binary...' 
            });

            const binary = args.join(' ');
            const apiUrl = `https://api.giftedtech.co.ke/api/tools/dbinary?apikey=gifted&query=${encodeURIComponent(binary)}`;
            
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.success && data.result) {
                const resultText = `╭━━━『 💾 BINARY DECODED 』\n┃\n┃ 🔢 Binary:\n┃ ${binary.substring(0, 50)}${binary.length > 50 ? '...' : ''}\n┃\n┃━━━━━━━━━━━━━━\n┃\n┃ ✅ Decoded:\n┃ ${data.result}\n┃\n╰━━━━━━━━━━━━━━━⬣\n\n_${config.bot.name}_`;
                
                await sock.sendMessage(jid.chat, { text: resultText });
                logging.success(`[DBINARY] Binary decoded`);
            } else {
                await sock.sendMessage(jid.chat, { 
                    text: '❌ Failed to decode! Check binary format.' 
                });
            }

        } catch (error) {
            logging.error(`[DBINARY] Error: ${error.message}`);
            await sock.sendMessage(jid.chat, { 
                text: `❌ Error decoding!` 
            });
        }
    }
};