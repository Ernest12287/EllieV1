import config from '../config.js';
import { getChatJid } from '../utils/jidHelper.js';
export default {
    name: 'twitter',
    description: 'Download Twitter videos',
    usage: '.twitter <url>',
    category: 'Download',
    
    async execute(sock, message, args) {
        const jid = getChatJid(message);
        
        if (args.length < 1) {
            await sock.sendMessage(jid.chat, { 
                text: `❌ Usage: ${config.bot.preffix}twitter <url>\n\nExample: ${config.bot.preffix}twitter https://twitter.com/user/status/123456`
            });
        }

        const url = args[0];
        const apiUrl = 'https://downloader-yys6.onrender.com/api/download';
        
        try {
            await sock.sendMessage(jid.chat, { 
                text: '⏳ Downloading Twitter video...' 
            });

            const response = await fetch(`${apiUrl}?url=${encodeURIComponent(url)}`);
            const data = await response.json();

            if (data.success) {
                const content = data.data;
                
                if (content.video_url) {
                    await sock.sendMessage(jid.chat, {
                        video: { url: content.video_url },
                        caption: `🐦 *Twitter Video*\n\n📝 *Title:* ${content.title || 'Tweet video'}\n👤 *Author:* ${content.author}`
                    });
                } else {
                    let messageText = `✅ *Twitter Content*\n\n`;
                    messageText += `📝 *Title:* ${content.title || 'No title'}\n`;
                    messageText += `👤 *Author:* ${content.author}\n`;
                    
                    if (content.thumbnail) {
                        await sock.sendMessage(jid.chat, {
                            image: { url: content.thumbnail },
                            caption: messageText
                        });
                    } else {
                        await sock.sendMessage(jid.chat, { 
                            text: messageText 
                        });
                    }
                }

            } else {
                await sock.sendMessage(jid.chat, { 
                    text: '❌ Failed to download Twitter content. Please check the URL.' 
                });
            }

        } catch (error) {
            console.error('Twitter download error:', error);
            await sock.sendMessage(jid.chat, { 
                text: '❌ Error downloading Twitter content. Please try again later.' 
            });
        }
    }
};