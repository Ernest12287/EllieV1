import config from '../config.js';
import logging from '../logger.js';

export default {
    name: 'cat',
    aliases: ['kitty', 'kitten'],
    description: 'Get random cat images',
    usage: '.cat',
    category: 'Fun',
    
    async execute(sock, message, args) {
        const sender = message.key.remoteJid;
        
        try {
            await sock.sendMessage(sender, { 
                text: '🐱 Fetching cat...' 
            });

            const apiUrl = 'https://api.thecatapi.com/v1/images/search';
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data && data[0] && data[0].url) {
                const caption = `╭━━━『 🐱 MEOW 』\n┃\n┃ 😻 Random Cat\n┃\n╰━━━━━━━━━━━━━━━⬣\n\n_${config.bot.name}_`;
                
                await sock.sendMessage(sender, {
                    image: { url: data[0].url },
                    caption: caption
                });
                
                logging.success(`[CAT] Sent cat image`);
            } else {
                await sock.sendMessage(sender, { 
                    text: '❌ Could not fetch cat. Try again!' 
                });
            }

        } catch (error) {
            logging.error(`[CAT] Error: ${error.message}`);
            await sock.sendMessage(sender, { 
                text: '❌ Failed to fetch cat image.' 
            });
        }
    }
};