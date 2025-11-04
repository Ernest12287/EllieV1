import config from '../config.js';

export default {
    name: 'yt',
    description: 'Quick YouTube search',
    usage: '.yt <query>',
    category: 'Media',
    
    async execute(sock, message, args) {
        const sender = message.key.remoteJid;
        
        if (args.length < 1) {
            return await sock.sendMessage(sender, { 
                text: `❌ Usage: ${config.bot.preffix}yt <search query>`
            });
        }

        const query = args.join(' ');
        const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
        
        await sock.sendMessage(sender, { 
            text: `🔍 *YouTube Search: "${query}"*\n\n🔗 Search Results: ${searchUrl}\n\n*Tip:* Use the link above to browse YouTube results directly.` 
        });
    }
};