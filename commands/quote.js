import config from '../config.js';
import logging from '../logger.js';

export default {
    name: 'quote',
    aliases: ['quotes', 'inspire'],
    description: 'Get random inspirational quotes',
    usage: '.quote [category]',
    category: 'Fun',
    
    async execute(sock, message, args) {
        const sender = message.key.remoteJid;
        const category = args[0]?.toLowerCase() || 'random';
        
        try {
            await sock.sendMessage(sender, { 
                text: '💭 Fetching quote...' 
            });

            const apiUrl = category === 'random' 
                ? 'https://api.quotable.io/random'
                : `https://api.quotable.io/random?tags=${encodeURIComponent(category)}`;
            
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data && data.content) {
                const quoteText = `╭━━━『 💭 QUOTE 』\n┃\n┃ "${data.content}"\n┃\n┃ — *${data.author}*\n┃\n╰━━━━━━━━━━━━━━━⬣\n\n🏷️ Tags: ${data.tags.join(', ')}\n_${config.bot.name}_`;
                
                await sock.sendMessage(sender, { text: quoteText });
                logging.success(`[QUOTE] Sent quote by ${data.author}`);
            } else {
                await sock.sendMessage(sender, { 
                    text: `❌ No quotes found for category: ${category}\n\n💡 Try: life, love, success, happiness` 
                });
            }

        } catch (error) {
            logging.error(`[QUOTE] Error: ${error.message}`);
            await sock.sendMessage(sender, { 
                text: '❌ Failed to fetch quote.' 
            });
        }
    }
};