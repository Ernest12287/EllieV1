import config from '../config.js';

export default {
    name: 'megumin',
    description: 'Get random Megumin images',
    usage: '.megumin',
    category: 'Anime',
    
    async execute(sock, message, args) {
        const sender = message.key.remoteJid;

        try {
            const apiUrl = 'https://api.waifu.pics/sfw/megumin';
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.url) {
                await sock.sendMessage(sender, {
                    image: { url: data.url },
                    caption: '💥 EXPLOSION! Megumin!'
                });
            } else {
                await sock.sendMessage(sender, { 
                    text: '❌ Failed to fetch Megumin image.' 
                });
            }

        } catch (error) {
            console.error('Megumin error:', error);
            await sock.sendMessage(sender, { 
                text: '❌ Error fetching Megumin image.' 
            });
        }
    }
};