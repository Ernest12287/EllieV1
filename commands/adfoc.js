import config from '../config.js';
import { getChatJid } from '../utils/jidHelper.js';
export default {
  name: 'adfoc',
  description: 'Shorten URLs with AdFoc! 💰',
  usage: '.adfoc <url>',
  category: 'Tools',
  async execute(sock, message, args) {
    const jid = getChatJid(message);
    
    if (args.length < 1) {
      await sock.sendMessage(jid.chat, { 
        text: `┏━━━━━━━━━━━━━━━━━━┓
┃  💰 *ADFOC* 
┗━━━━━━━━━━━━━━━━━━┛

❌ *Missing URL!*

📝 *Usage:* 
   ${config.bot.preffix}adfoc <url>

💡 *Example:* 
   ${config.bot.preffix}adfoc https://example.com`
      }, { quoted: message });
    }

    const url = args[0];
    const apiUrl = `https://api.giftedtech.co.ke/api/tools/adfoc?apikey=gifted&url=${encodeURIComponent(url)}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.success) {
        await sock.sendMessage(jid.chat, { 
          text: `┏━━━━━━━━━━━━━━━━━━┓
┃  💰 *ADFOC RESULT* 
┗━━━━━━━━━━━━━━━━━━┛

✅ *URL Shortened!*

📎 *Original:*
   ${url.substring(0, 50)}${url.length > 50 ? '...' : ''}

🔗 *Short URL:*
   ${data.result}

━━━━━━━━━━━━━━━━━━
_Easy to share! Copy & paste_ ✨`
        }, { quoted: message });
      } else {
        await sock.sendMessage(jid.chat, { 
          text: `❌ *Failed!* Invalid URL format.`
        }, { quoted: message });
      }
    } catch (error) {
      await sock.sendMessage(jid.chat, { 
        text: `❌ *Error!* ${error.message}`
      }, { quoted: message });
    }
  }
};