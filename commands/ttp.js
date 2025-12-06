import config from '../config.js';
import logging from '../logger.js';
import { getChatJid } from '../utils/jidHelper.js';
export default {
    name: 'ttp',
    aliases: ['textsticker', 'texttosticker'],
    description: 'Convert text to sticker',
    usage: '.ttp <text>',
    category: 'Sticker',
    
    async execute(sock, message, args) {
        const jid = getChatJid(message);
        
        if (args.length < 1) {
            await sock.sendMessage(jid.chat, { 
                text: `╭━━━『 🎨 TEXT TO STICKER 』\n┃\n┃ ❌ Usage: ${config.bot.preffix}ttp <text>\n┃\n┃ 💡 Example:\n┃ ${config.bot.preffix}ttp Hello World\n┃ ${config.bot.preffix}ttp Good Morning\n┃\n╰━━━━━━━━━━━━━━━⬣`
            });
        }

        try {
            await sock.sendMessage(jid.chat, { 
                text: '🎨 Creating sticker...' 
            });

            const text = args.join(' ');
            const apiUrl = `https://api.giftedtech.co.ke/api/tools/ttp?apikey=gifted&query=${encodeURIComponent(text)}`;
            
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.success && data.result) {
                await sock.sendMessage(jid.chat, {
                    sticker: { url: data.result },
                    mimetype: 'image/webp'
                });
                
                logging.success(`[TTP] Sticker created: ${text}`);
            } else {
                await sock.sendMessage(jid.chat, { 
                    text: '❌ Failed to create sticker!' 
                });
            }

        } catch (error) {
            logging.error(`[TTP] Error: ${error.message}`);
            await sock.sendMessage(jid.chat, { 
                text: `❌ Error creating sticker!` 
            });
        }
    }
};