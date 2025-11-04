import config from '../config.js';

export default {
    name: 'download',
    description: 'Download from any supported platform',
    usage: '.download <url>',
    category: 'Download',
    
    async execute(sock, message, args) {
        const sender = message.key.remoteJid;
        
        if (args.length < 1) {
            return await sock.sendMessage(sender, { 
                text: `❌ Usage: ${config.bot.preffix}download <url>\n\nSupported platforms:\n• TikTok\n• Douyin\n• Twitter\n• WeiBo\n• YouTube\n• Instagram\n• Facebook\n• And 1000+ more sites!`
            });
        }

        const url = args[0];
        const apiUrl = 'https://downloader-yys6.onrender.com/api/download';
        
        try {
            await sock.sendMessage(sender, { 
                text: '⏳ Downloading content...' 
            });

            const response = await fetch(`${apiUrl}?url=${encodeURIComponent(url)}`);
            const data = await response.json();

            if (data.success) {
                const content = data.data;
                
                let platformEmoji = '🌐';
                if (content.platform.includes('tiktok')) platformEmoji = '🎵';
                if (content.platform.includes('twitter')) platformEmoji = '🐦';
                if (content.platform.includes('douyin')) platformEmoji = '📹';
                if (content.platform.includes('youtube')) platformEmoji = '📺';
                
                if (content.video_url) {
                    await sock.sendMessage(sender, {
                        video: { url: content.video_url },
                        caption: `${platformEmoji} *${content.platform.toUpperCase()} Video*\n\n📝 *Title:* ${content.title || 'No title'}\n👤 *Author:* ${content.author}\n⏱️ *Duration:* ${content.duration}s`
                    });
                } else {
                    let messageText = `${platformEmoji} *${content.platform.toUpperCase()} Content*\n\n`;
                    messageText += `📝 *Title:* ${content.title || 'No title'}\n`;
                    messageText += `👤 *Author:* ${content.author}\n`;
                    messageText += `⏱️ *Duration:* ${content.duration}s\n`;
                    messageText += `👀 *Views:* ${content.view_count || 'N/A'}\n\n`;
                    messageText += `ℹ️ *Note:* Direct download not available for this content.`;

                    if (content.thumbnail) {
                        await sock.sendMessage(sender, {
                            image: { url: content.thumbnail },
                            caption: messageText
                        });
                    } else {
                        await sock.sendMessage(sender, { 
                            text: messageText 
                        });
                    }
                }

            } else {
                await sock.sendMessage(sender, { 
                    text: '❌ Download failed. Please check the URL and try again.' 
                });
            }

        } catch (error) {
            console.error('Download error:', error);
            await sock.sendMessage(sender, { 
                text: '❌ Error downloading content. Please try again later.' 
            });
        }
    }
};