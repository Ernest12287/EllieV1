import config from '../config.js';
import logging from '../logger.js';

export default {
    name: 'ttp',
    aliases: ['textsticker', 'texttosticker'],
    description: 'Convert text to sticker',
    usage: '.ttp <text>',
    category: 'Sticker',
    
    async execute(sock, message, args) {
        const sender = message.key.remoteJid;
        
        if (args.length < 1) {
            return await sock.sendMessage(sender, { 
                text: `╭━━━『 🎨 TEXT TO STICKER 』\n┃\n┃ ❌ Usage: ${config.bot.preffix}ttp <text>\n┃\n┃ 💡 Example:\n┃ ${config.bot.preffix}ttp Hello World\n┃ ${config.bot.preffix}ttp Good Morning\n┃\n╰━━━━━━━━━━━━━━━⬣`
            });
        }

        try {
            await sock.sendMessage(sender, { 
                text: '🎨 Creating sticker...' 
            });

            const text = args.join(' ');
            const apiUrl = `https://api.giftedtech.co.ke/api/tools/ttp?apikey=gifted&query=${encodeURIComponent(text)}`;
            
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.success && data.result) {
                await sock.sendMessage(sender, {
                    sticker: { url: data.result },
                    mimetype: 'image/webp'
                });
                
                logging.success(`[TTP] Sticker created: ${text}`);
            } else {
                await sock.sendMessage(sender, { 
                    text: '❌ Failed to create sticker!' 
                });
            }

        } catch (error) {
            logging.error(`[TTP] Error: ${error.message}`);
            await sock.sendMessage(sender, { 
                text: `❌ Error creating sticker!` 
            });
        }
    }
};