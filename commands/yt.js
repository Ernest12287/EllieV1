import config from '../config.js';
import { getChatJid } from '../utils/jidHelper.js';
export default {
    name: 'yt',
    description: 'Quick YouTube search',
    usage: '.yt <query>',
    category: 'Media',
    
    async execute(sock, message, args) {
        const jid = getChatJid(message);
        
        if (args.length < 1) {
            await sock.sendMessage(jid.chat, { 
                text: `❌ Usage: ${config.bot.preffix}yt <search query>`
            });
        }

        const query = args.join(' ');
        const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
        
        await sock.sendMessage(jid.chat, { 
            text: `🔍 *YouTube Search: "${query}"*\n\n🔗 Search Results: ${searchUrl}\n\n*Tip:* Use the link above to browse YouTube results directly.` 
        });
    }
};