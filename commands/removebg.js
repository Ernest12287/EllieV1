import config from '../config.js';
import { getChatJid } from '../utils/jidHelper.js';
export default {
  name: 'removebg',
  aliases: ['rembg', 'nobg'],
  description: 'Remove image background! 🎭',
  usage: '.removebg <image_url>',
  category: 'Tools',
  async execute(sock, message, args) {
    const jid = getChatJid(message);
    
    if (args.length < 1) {
      await sock.sendMessage(jid.chat, { 
        text: `┏━━━━━━━━━━━━━━━━━━┓
┃  🎭 *REMOVE BACKGROUND* 
┗━━━━━━━━━━━━━━━━━━┛

❌ *Missing image URL!*

📝 *Usage:* 
   ${config.bot.preffix}removebg <image_url>

💡 *Example:* 
   ${config.bot.preffix}removebg https://example.com/photo.jpg

🎭 AI-powered background removal!`
      }, { quoted: message });
    }

    const imageUrl = args[0];
    const apiUrl = `https://api.giftedtech.co.ke/api/tools/removebg?apikey=gifted&url=${encodeURIComponent(imageUrl)}`;

    try {
      await sock.sendMessage(jid.chat, { 
        text: `🎭 *Processing image...*

🖼️ Analyzing...
✨ Removing background...
⏳ Almost done...

_Please wait!_ 🤖`
      }, { quoted: message });

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.success && data.result) {
        const caption = `┏━━━━━━━━━━━━━━━━━━┓
┃  🎭 *BACKGROUND REMOVED* 
┗━━━━━━━━━━━━━━━━━━┛

✅ *Success!*

📊 *Size:* ${data.result.size}

━━━━━━━━━━━━━━━━━━
_AI Background Removal_ 🎭`;

        await sock.sendMessage(jid.chat, {
          image: { url: data.result.image_url },
          caption: caption
        }, { quoted: message });
      } else {
        await sock.sendMessage(jid.chat, { 
          text: `❌ *Failed to remove background!*

Make sure:
• URL is valid
• Image is accessible
• Format is supported`
        }, { quoted: message });
      }
    } catch (error) {
      console.error('RemoveBG error:', error);
      await sock.sendMessage(jid.chat, { 
        text: `❌ *Error!* ${error.message}`
      }, { quoted: message });
    }
  }
};