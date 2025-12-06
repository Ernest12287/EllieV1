import config from '../config.js';
import logging from '../logger.js';
import { getChatJid } from '../utils/jidHelper.js';
export default {
    name: 'youtube',
    aliases: ['yts'],
    description: 'Search and get YouTube video info',
    usage: '.youtube <search query>',
    category: 'Media',
    
    async execute(sock, message, args) {
        const jid = getChatJid(message);
        
        if (args.length === 0) {
            await sock.sendMessage(jid.chat, { 
                text: `╭━━━『 🎥 YOUTUBE SEARCH 』\n┃\n┃ ❌ Please provide a search query!\n┃\n┃ 📝 Usage: ${config.bot.preffix}youtube <query>\n┃\n┃ 💡 Example:\n┃ ${config.bot.preffix}youtube despacito\n┃\n╰━━━━━━━━━━━━━━━⬣` 
            });
            return;
        }
        
        const query = args.join(' ');
        
        try {
            await sock.sendMessage(jid.chat, { 
                text: `🔍 Searching YouTube for: *${query}*\n\n⏳ Please wait...` 
            });
            
            logging.info(`[YOUTUBE] Searching for: ${query}`);
            
            // Use YouTube Data API v3 (free quota)
            const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${encodeURIComponent(query)}&type=video&key=AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY`;
            
            const response = await fetch(apiUrl);
            const data = await response.json();
            
            if (!data.items || data.items.length === 0) {
                await sock.sendMessage(jid.chat, { 
                    text: `❌ No results found for: *${query}*` 
                });
                return;
            }
            
            let resultText = `╭━━━『 🎥 YOUTUBE RESULTS 』\n┃\n┃ 🔍 Query: *${query}*\n┃\n`;
            
            data.items.forEach((item, index) => {
                const title = item.snippet.title;
                const channel = item.snippet.channelTitle;
                const videoId = item.id.videoId;
                const url = `https://youtu.be/${videoId}`;
                
                resultText += `┃━━━━━━━━━━━━━━\n`;
                resultText += `┃ ${index + 1}. *${title}*\n`;
                resultText += `┃ 📺 ${channel}\n`;
                resultText += `┃ 🔗 ${url}\n`;
                resultText += `┃\n`;
            });
            
            resultText += `╰━━━━━━━━━━━━━━━⬣\n\n`;
            resultText += `💾 *Download:* Use ${config.bot.preffix}ytdl <url> to download\n`;
            resultText += `_Powered by ${config.bot.name}_`;
            
            // Send thumbnail of first result
            if (data.items[0].snippet.thumbnails?.high?.url) {
                await sock.sendMessage(jid.chat, {
                    image: { url: data.items[0].snippet.thumbnails.high.url },
                    caption: resultText
                });
            } else {
                await sock.sendMessage(jid.chat, { text: resultText });
            }
            
            logging.success(`[YOUTUBE] Search results sent for: ${query}`);
            
        } catch (error) {
            logging.error(`[YOUTUBE] Error: ${error.message}`);
            await sock.sendMessage(jid.chat, { 
                text: `❌ Search failed.\n\n*Error:* ${error.message}` 
            });
        }
    }
};