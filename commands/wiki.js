import config from '../config.js';
import logging from '../logger.js';
import { getChatJid } from '../utils/jidHelper.js';
export default {
    name: 'wiki',
    aliases: ['wikipedia', 'lookfor'],
    description: 'Search Wikipedia and get detailed information',
    usage: '.wiki <search term>',
    category: 'Knowledge',
    
    async execute(sock, message, args) {
        const jid = getChatJid(message);
        
        if (args.length < 1) {
            await sock.sendMessage(jid.chat, { 
                text: `╭━━━『 📚 WIKIPEDIA 』\n┃\n┃ ❌ Usage: ${config.bot.preffix}wiki <term>\n┃\n┃ 💡 Examples:\n┃ ${config.bot.preffix}wiki Einstein\n┃ ${config.bot.preffix}wiki Quantum Physics\n┃ ${config.bot.preffix}wiki Ancient Rome\n┃\n╰━━━━━━━━━━━━━━━⬣`
            });
        }

        try {
            await sock.sendMessage(jid.chat, { 
                text: '🔍 Searching Wikipedia...' 
            });

            const query = args.join(' ');
            const apiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
            const response = await fetch(apiUrl);
            
            if (response.status === 200) {
                const data = await response.json();
                
                let messageText = `╭━━━『 📚 WIKIPEDIA 』\n┃\n`;
                messageText += `┃ 📖 *${data.title}*\n┃\n`;
                
                if (data.description) {
                    messageText += `┃ 📝 ${data.description}\n┃\n`;
                }
                
                messageText += `┃━━━━━━━━━━━━━━\n┃\n`;
                
                // Truncate extract to 800 chars
                const extract = data.extract.length > 800 
                    ? data.extract.substring(0, 800) + '...' 
                    : data.extract;
                
                messageText += `${extract}\n\n`;
                messageText += `╰━━━━━━━━━━━━━━━⬣\n\n`;
                messageText += `🔗 Read more: ${data.content_urls.desktop.page}\n`;
                messageText += `_Powered by ${config.bot.name}_`;
                
                if (data.thumbnail?.source) {
                    await sock.sendMessage(jid.chat, {
                        image: { url: data.thumbnail.source },
                        caption: messageText
                    });
                } else {
                    await sock.sendMessage(jid.chat, { text: messageText });
                }
                
                logging.success(`[WIKI] Info sent for: ${query}`);
                
            } else {
                await sock.sendMessage(jid.chat, { 
                    text: `❌ No Wikipedia page found for *"${query}"*\n\n💡 Try different keywords or check spelling.` 
                });
            }

        } catch (error) {
            logging.error(`[WIKI] Error: ${error.message}`);
            await sock.sendMessage(jid.chat, { 
                text: '❌ Wikipedia search failed. Please try again.' 
            });
        }
    }
};