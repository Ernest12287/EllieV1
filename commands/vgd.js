import config from '../config.js';

export default {
  name: 'vgd',
  description: 'Shorten URLs with V.gd! ⚡',
  usage: '.vgd <url>',
  category: 'Tools',
  async execute(sock, message, args) {
    const sender = message.key.remoteJid;
    
    if (args.length < 1) {
      return await sock.sendMessage(sender, { 
        text: `┏━━━━━━━━━━━━━━━━━━┓
┃  ⚡ *V.GD* 
┗━━━━━━━━━━━━━━━━━━┛

❌ *Missing URL!*

📝 *Usage:* 
   ${config.bot.preffix}vgd <url>

💡 *Example:* 
   ${config.bot.preffix}vgd https://example.com`
      }, { quoted: message });
    }

    const url = args[0];
    const apiUrl = `https://api.giftedtech.co.ke/api/tools/vgd?apikey=gifted&url=${encodeURIComponent(url)}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.success) {
        await sock.sendMessage(sender, { 
          text: `┏━━━━━━━━━━━━━━━━━━┓
┃  ⚡ *V.GD RESULT* 
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
        await sock.sendMessage(sender, { 
          text: `❌ *Failed!* Invalid URL format.`
        }, { quoted: message });
      }
    } catch (error) {
      await sock.sendMessage(sender, { 
        text: `❌ *Error!* ${error.message}`
      }, { quoted: message });
    }
  }
};