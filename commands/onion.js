import config from '../config.js';

export default {
    name: 'onion',
    description: 'Search for onion sites (dark web links)',
    usage: '.onion <search term>',
    category: 'Search',
    
    async execute(sock, message, args) {
        const sender = message.key.remoteJid;
        
        if (args.length < 1) {
            return await sock.sendMessage(sender, { 
                text: `❌ Usage: ${config.bot.preffix}onion <search term>\n\nExamples:\n• ${config.bot.preffix}onion "marketplace"\n• ${config.bot.preffix}onion "forum"\n• ${config.bot.preffix}onion "wiki"`
            });
        }

        try {
            await sock.sendMessage(sender, { 
                text: '⏳ Searching onion sites...' 
            });

            const query = args.join(' ');
            
            // Using Ahmia search (free onion search engine)
            const apiUrl = `https://ahmia.fi/search/?q=${encodeURIComponent(query)}`;
            
            // Note: This returns HTML, so we'll provide the search link
            // For actual onion links, users need Tor browser
            
            const messageText = `🧅 *Onion Search: "${query}"*\n\n` +
                               `🔍 *Search Results:* ${apiUrl}\n\n` +
                               `*Important Notes:*\n` +
                               `• Use Tor Browser to access .onion sites\n` +
                               `• Be cautious of illegal content\n` +
                               `• Maintain your privacy and security\n` +
                               `• Ahmia.fi is a safe search engine for onion sites\n\n` +
                               `🔗 *Tor Browser Download:* https://www.torproject.org/`;

            await sock.sendMessage(sender, { 
                text: messageText 
            });

        } catch (error) {
            console.error('Onion search error:', error);
            await sock.sendMessage(sender, { 
                text: '❌ Error searching onion sites. Please try again.' 
            });
        }
    }
};