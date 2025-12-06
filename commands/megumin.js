import config from '../config.js';
import { getChatJid } from '../utils/jidHelper.js';
export default {
    name: 'megumin',
    description: 'Get random Megumin images',
    usage: '.megumin',
    category: 'Anime',
    
    async execute(sock, message, args) {
        const jid = getChatJid(message);

        try {
            const apiUrl = 'https://api.waifu.pics/sfw/megumin';
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.url) {
                await sock.sendMessage(jid.chat, {
                    image: { url: data.url },
                    caption: '💥 EXPLOSION! Megumin!'
                });
            } else {
                await sock.sendMessage(jid.chat, { 
                    text: '❌ Failed to fetch Megumin image.' 
                });
            }

        } catch (error) {
            console.error('Megumin error:', error);
            await sock.sendMessage(jid.chat, { 
                text: '❌ Error fetching Megumin image.' 
            });
        }
    }
};