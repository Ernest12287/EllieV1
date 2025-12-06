import config from '../config.js';
import { getChatJid } from '../utils/jidHelper.js';
export default {
  name: 'fluximg',
  aliases: ['flux', 'fluxai'],
  description: 'Generate images with Flux AI! ⚡',
  usage: '.fluximg <prompt>',
  category: 'AI',
  async execute(sock, message, args) {
    const jid = getChatJid(message);
    
    if (args.length < 1) {
      await sock.sendMessage(jid.chat, { 
        text: `┏━━━━━━━━━━━━━━━━━━┓
┃  ⚡ *FLUX IMAGE AI* 
┗━━━━━━━━━━━━━━━━━━┛

❌ *Missing prompt!*

📝 *Usage:* 
   ${config.bot.preffix}fluximg <prompt>

💡 *Examples:* 
   ${config.bot.preffix}fluximg Cyberpunk samurai warrior
   ${config.bot.preffix}fluximg Magical forest with fireflies

⚡ Ultra-realistic AI images!`
      }, { quoted: message });
    }

    const prompt = args.join(' ');
    const apiUrl = `https://api.giftedtech.co.ke/api/ai/fluximg?apikey=gifted&prompt=${encodeURIComponent(prompt)}`;

    try {
      await sock.sendMessage(jid.chat, { 
        text: `┏━━━━━━━━━━━━━━━━━━┓
┃  ⚡ *FLUX AI WORKING* 
┗━━━━━━━━━━━━━━━━━━┛

💭 *Prompt:* ${prompt}

⚡ Flux is generating...
🎨 Rendering high quality...
✨ Almost done...

_Creating masterpiece!_ 🖼️`
      }, { quoted: message });

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.success && data.result) {
        const caption = `┏━━━━━━━━━━━━━━━━━━┓
┃  ⚡ *FLUX AI IMAGE* 
┗━━━━━━━━━━━━━━━━━━┛

💭 *Prompt:*
${prompt}

━━━━━━━━━━━━━━━━━━
_Powered by Flux AI_ ⚡`;

        await sock.sendMessage(jid.chat, {
          image: { url: data.result },
          caption: caption
        }, { quoted: message });
      } else {
        await sock.sendMessage(jid.chat, { 
          text: `❌ *Flux Generation Failed!*

Try a different prompt!`
        }, { quoted: message });
      }
    } catch (error) {
      console.error('Flux Image error:', error);
      await sock.sendMessage(jid.chat, { 
        text: `❌ *Error!* ${error.message}`
      }, { quoted: message });
    }
  }
};