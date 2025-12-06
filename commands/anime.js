import config from '../config.js';
import logging from '../logger.js';
import { getChatJid } from '../utils/jidHelper.js';
export default {
    name: 'anime',
    aliases: ['animesearch', 'animeinfo'],
    description: 'Search for anime information',
    usage: '.anime <anime name>',
    category: 'Anime',
    
    async execute(sock, message, args) {
        const jid = getChatJid(message);
        
        if (args.length < 1) {
            await sock.sendMessage(jid.chat, { 
                text: `╭━━━『 🎌 ANIME SEARCH 』\n┃\n┃ ❌ Usage: ${config.bot.preffix}anime <name>\n┃\n┃ 💡 Examples:\n┃ ${config.bot.preffix}anime naruto\n┃ ${config.bot.preffix}anime one piece\n┃ ${config.bot.preffix}anime death note\n┃\n╰━━━━━━━━━━━━━━━⬣`
            });
        }

        try {
            await sock.sendMessage(jid.chat, { 
                text: '🔍 Searching anime...' 
            });

            const query = args.join(' ');
            const apiUrl = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=1`;
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data && data.data && data.data.length > 0) {
                const anime = data.data[0];
                
                const animeText = `╭━━━『 🎌 ANIME INFO 』\n┃\n┃ 📺 *${anime.title}*\n┃\n┃━━━━━━━━━━━━━━\n┃\n┃ 🎭 Type: ${anime.type}\n┃ 📊 Episodes: ${anime.episodes || 'N/A'}\n┃ ⭐ Score: ${anime.score || 'N/A'}/10\n┃ 📅 Aired: ${anime.aired?.string || 'N/A'}\n┃ 🎬 Status: ${anime.status}\n┃ 🎨 Genres: ${anime.genres.map(g => g.name).join(', ')}\n┃\n┃━━━━━━━━━━━━━━\n┃ 📖 *Synopsis:*\n┃ ${anime.synopsis?.substring(0, 200)}...\n┃\n╰━━━━━━━━━━━━━━━⬣\n\n🔗 ${anime.url}\n_${config.bot.name}_`;
                
                if (anime.images?.jpg?.large_image_url) {
                    await sock.sendMessage(jid.chat, {
                        image: { url: anime.images.jpg.large_image_url },
                        caption: animeText
                    });
                } else {
                    await sock.sendMessage(jid.chat, { text: animeText });
                }
                
                logging.success(`[ANIME] Sent info for: ${anime.title}`);
            } else {
                await sock.sendMessage(jid.chat, { 
                    text: `❌ No anime found for *"${query}"*\n\n💡 Try different keywords.` 
                });
            }

        } catch (error) {
            logging.error(`[ANIME] Error: ${error.message}`);
            await sock.sendMessage(jid.chat, { 
                text: '❌ Failed to fetch anime data.' 
            });
        }
    }
};