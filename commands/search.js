import config from '../config.js';

export default {
    name: 'bsearch',
    description: 'Search the Bible for keywords',
    usage: '.bsearch <keyword>',
    category: 'Bible',
    
    async execute(sock, message, args) {
        const sender = message.key.remoteJid;
        
        if (args.length < 1) {
            return await sock.sendMessage(sender, { 
                text: `❌ Usage: ${config.bot.preffix}bsearch <keyword>\n\nExamples:\n• ${config.bot.preffix}bsearch love\n• ${config.bot.preffix}bsearch faith hope\n• ${config.bot.preffix}bsearch "the lord is my shepherd"`
            });
        }

        try {
            await sock.sendMessage(sender, { 
                text: '⏳ Searching Bible...' 
            });

            const query = args.join(' ');
            const apiUrl = `https://bible-api.com/?search=${encodeURIComponent(query)}&translation=kjv`;
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.verses && data.verses.length > 0) {
                let messageText = `🔍 *Bible Search Results for "${query}"*\n\n`;
                
                // Show first 5 results to avoid too long messages
                const maxResults = 5;
                data.verses.slice(0, maxResults).forEach(verse => {
                    messageText += `*${verse.book_name} ${verse.chapter}:${verse.verse}*\n`;
                    messageText += `${verse.text}\n\n`;
                });

                if (data.verses.length > maxResults) {
                    messageText += `... and ${data.verses.length - maxResults} more results.`;
                }

                await sock.sendMessage(sender, { 
                    text: messageText 
                });

            } else {
                await sock.sendMessage(sender, { 
                    text: `❌ No results found for "${query}"` 
                });
            }

        } catch (error) {
            console.error('Bible search error:', error);
            await sock.sendMessage(sender, { 
                text: '❌ Error searching Bible. Please try again.' 
            });
        }
    }
};