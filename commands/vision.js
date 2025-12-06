import config from '../config.js';
import { getChatJid } from '../utils/jidHelper.js';
export default {
  name: 'vision',
  aliases: ['visionai', 'describe'],
  description: 'AI describes images! 👁️',
  usage: '.vision <image_url> <prompt>',
  category: 'AI',
  async execute(sock, message, args) {
    const jid = getChatJid(message);
    
    if (args.length < 2) {
      await sock.sendMessage(jid.chat, { 
        text: `┏━━━━━━━━━━━━━━━━━━┓
┃  👁️ *VISION AI* 
┗━━━━━━━━━━━━━━━━━━┛

❌ *Missing parameters!*

📝 *Usage:* 
   ${config.bot.preffix}vision <image_url> <prompt>

💡 *Example:* 
   ${config.bot.preffix}vision https://example.com/image.jpg Describe this image in detail

👁️ AI-powered image analysis!`
      }, { quoted: message });
    }

    const imageUrl = args[0];
    const prompt = args.slice(1).join(' ');
    const apiUrl = `https://api.giftedtech.co.ke/api/ai/vision?apikey=gifted&url=${encodeURIComponent(imageUrl)}&prompt=${encodeURIComponent(prompt)}`;

    try {
      await sock.sendMessage(jid.chat, { 
        text: `👁️ *Vision AI analyzing...*

🖼️ Processing image...
🔍 Understanding content...
✨ Generating description...

_This may take a moment!_ 🤖`
      }, { quoted: message });

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.success && data.result) {
        await sock.sendMessage(jid.chat, { 
          text: `┏━━━━━━━━━━━━━━━━━━┓
┃  👁️ *VISION AI RESULT* 
┗━━━━━━━━━━━━━━━━━━┛

🖼️ *Image URL:*
${imageUrl}

━━━━━━━━━━━━━━━━━━

📝 *AI Description:*

${data.result}

━━━━━━━━━━━━━━━━━━
_Vision AI Analysis_ 👁️`
        }, { quoted: message });
      } else {
        await sock.sendMessage(jid.chat, { 
          text: `❌ *Vision AI Error!*

Unable to analyze image. Make sure:
• URL is valid
• Image is accessible
• Format is supported (JPG, PNG, etc.)`
        }, { quoted: message });
      }
    } catch (error) {
      console.error('Vision AI error:', error);
      await sock.sendMessage(jid.chat, { 
        text: `❌ *Error!* ${error.message}`
      }, { quoted: message });
    }
  }
};