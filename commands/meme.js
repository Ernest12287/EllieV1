import config from '../config.js';
import logging from '../logger.js';
import { getChatJid } from '../utils/jidHelper.js';
export default {
    name: 'meme',
    aliases: ['memes', 'randommeme'],
    description: 'Get random memes from Reddit',
    usage: '.meme',
    category: 'Fun',
    
    async execute(sock, message, args) {
        const jid = getChatJid(message);
        
        try {
            await sock.sendMessage(jid.chat, { 
                text: '😂 Finding a meme...' 
            });

            const subreddits = ['memes', 'dankmemes', 'wholesomememes', 'me_irl'];
            const randomSub = subreddits[Math.floor(Math.random() * subreddits.length)];
            
            const apiUrl = `https://meme-api.com/gimme/${randomSub}`;
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data && data.url) {
                const caption = `╭━━━『 😂 MEME 』\n┃\n┃ 📝 *${data.title}*\n┃\n┃ 👤 u/${data.author}\n┃ ⬆️ ${data.ups} upvotes\n┃ 📍 r/${data.subreddit}\n┃\n╰━━━━━━━━━━━━━━━⬣\n\n_${config.bot.name}_`;
                
                await sock.sendMessage(jid.chat, {
                    image: { url: data.url },
                    caption: caption
                });
                
                logging.success(`[MEME] Sent meme from r/${data.subreddit}`);
            } else {
                await sock.sendMessage(jid.chat, { 
                    text: '❌ Could not fetch meme. Try again!' 
                });
            }

        } catch (error) {
            logging.error(`[MEME] Error: ${error.message}`);
            await sock.sendMessage(jid.chat, { 
                text: '❌ Failed to fetch meme.' 
            });
        }
    }
};