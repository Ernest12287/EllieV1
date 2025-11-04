import config from '../config.js';
import logging from '../logger.js';

export default {
    name: 'ebinary',
    aliases: ['encodebinary', 'tobinary'],
    description: 'Encode text to binary',
    usage: '.ebinary <text>',
    category: 'Utility',
    
    async execute(sock, message, args) {
        const sender = message.key.remoteJid;
        
        if (args.length < 1) {
            return await sock.sendMessage(sender, { 
                text: `╭━━━『 💾 BINARY ENCODE 』\n┃\n┃ ❌ Usage: ${config.bot.preffix}ebinary <text>\n┃\n┃ 💡 Example:\n┃ ${config.bot.preffix}ebinary Hello\n┃\n╰━━━━━━━━━━━━━━━⬣`
            });
        }

        try {
            await sock.sendMessage(sender, { 
                text: '💾 Encoding to binary...' 
            });

            const text = args.join(' ');
            const apiUrl = `https://api.giftedtech.co.ke/api/tools/ebinary?apikey=gifted&query=${encodeURIComponent(text)}`;
            
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.success && data.result) {
                const resultText = `╭━━━『 💾 BINARY ENCODED 』\n┃\n┃ 📝 Original:\n┃ ${text}\n┃\n┃━━━━━━━━━━━━━━\n┃\n┃ 🔢 Binary:\n┃ ${data.result}\n┃\n╰━━━━━━━━━━━━━━━⬣\n\n_${config.bot.name}_`;
                
                await sock.sendMessage(sender, { text: resultText });
                logging.success(`[EBINARY] Text encoded to binary`);
            } else {
                await sock.sendMessage(sender, { 
                    text: '❌ Failed to encode!' 
                });
            }

        } catch (error) {
            logging.error(`[EBINARY] Error: ${error.message}`);
            await sock.sendMessage(sender, { 
                text: `❌ Error encoding!` 
            });
        }
    }
};