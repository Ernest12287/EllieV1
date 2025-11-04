import config from '../config.js';

export default {
  name: 'instagram',
  aliases: ['ig', 'igdl', 'insta'],
  description: 'Download Instagram posts, reels & stories! 📸',
  usage: '.instagram <url>',
  category: 'Download',
  async execute(sock, message, args) {
    const sender = message.key.remoteJid;
    
    if (args.length < 1) {
      return await sock.sendMessage(sender, { 
        text: `┏━━━━━━━━━━━━━━━━━━┓
┃  📸 *INSTAGRAM DOWNLOADER* 
┗━━━━━━━━━━━━━━━━━━┛

❌ *Missing Instagram URL!*

📝 *Usage:* 
   ${config.bot.preffix}instagram <url>

💡 *Example:* 
   ${config.bot.preffix}ig https://instagram.com/...

✨ Download posts, reels & stories!`
      }, { quoted: message });
    }

    const url = args[0];
    const apiUrl = `https://api.giftedtech.co.ke/api/download/instadl?apikey=gifted&url=${encodeURIComponent(url)}`;

    try {
      await sock.sendMessage(sender, { 
        text: `┏━━━━━━━━━━━━━━━━━━┓
┃  📸 *INSTAGRAM MAGIC* 
┗━━━━━━━━━━━━━━━━━━┛

⏳ *Downloading from Instagram...*
🔍 Extracting media...
✨ Processing content...

_Almost there!_ 💫`
      }, { quoted: message });

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.success && data.result) {
        const media = data.result;
        
        // Handle different media types
        if (Array.isArray(media)) {
          // Multiple media items
          for (let i = 0; i < media.length; i++) {
            const item = media[i];
            const caption = `📸 *Instagram Media ${i + 1}/${media.length}*\n\n_Downloaded via ${config.bot.name}_ 🤖`;
            
            if (item.type === 'video' || item.url.includes('.mp4')) {
              await sock.sendMessage(sender, {
                video: { url: item.url },
                caption: caption
              }, { quoted: message });
            } else {
              await sock.sendMessage(sender, {
                image: { url: item.url },
                caption: caption
              }, { quoted: message });
            }
          }
        } else {
          // Single media item
          const caption = `┏━━━━━━━━━━━━━━━━━━┓
┃  📸 *INSTAGRAM POST* 
┗━━━━━━━━━━━━━━━━━━┛

✨ *Downloaded Successfully!*

━━━━━━━━━━━━━━━━━━
_Via ${config.bot.name}_ 🤖`;

          if (media.type === 'video' || media.url?.includes('.mp4')) {
            await sock.sendMessage(sender, {
              video: { url: media.url || media.video_url },
              caption: caption
            }, { quoted: message });
          } else {
            await sock.sendMessage(sender, {
              image: { url: media.url || media.image_url },
              caption: caption
            }, { quoted: message });
          }
        }
      } else {
        await sock.sendMessage(sender, { 
          text: `❌ *Download Failed!*

Make sure:
• URL is valid
• Content is public
• Link is complete`
        }, { quoted: message });
      }
    } catch (error) {
      console.error('Instagram download error:', error);
      await sock.sendMessage(sender, { 
        text: `❌ *Error!* ${error.message}`
      }, { quoted: message });
    }
  }
};