import config from '../config.js';
import logging from '../logger.js';

export default {
    name: 'dog',
    aliases: ['doggo', 'puppy'],
    description: 'Get random dog images',
    usage: '.dog [breed]',
    category: 'Fun',
    
    async execute(sock, message, args) {
        const sender = message.key.remoteJid;
        const breed = args.join(' ').toLowerCase().replace(/ /g, '-');
        
        try {
            await sock.sendMessage(sender, { 
                text: '🐕 Fetching dog...' 
            });

            const apiUrl = breed 
                ? `https://dog.ceo/api/breed/${breed}/images/random`
                : 'https://dog.ceo/api/breeds/image/random';
            
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data && data.status === 'success' && data.message) {
                const caption = `╭━━━『 🐕 DOGGO 』\n┃\n┃ 🐶 Random ${breed || 'Dog'}\n┃\n╰━━━━━━━━━━━━━━━⬣\n\n_${config.bot.name}_`;
                
                await sock.sendMessage(sender, {
                    image: { url: data.message },
                    caption: caption
                });
                
                logging.success(`[DOG] Sent dog image`);
            } else {
                await sock.sendMessage(sender, { 
                    text: `❌ Breed not found!\n\n💡 Try: ${config.bot.preffix}dog husky\n${config.bot.preffix}dog golden` 
                });
            }

        } catch (error) {
            logging.error(`[DOG] Error: ${error.message}`);
            await sock.sendMessage(sender, { 
                text: '❌ Failed to fetch dog image.' 
            });
        }
    }
};