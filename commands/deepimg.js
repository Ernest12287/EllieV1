import config from '../config.js';
import { getChatJid } from '../utils/jidHelper.js';
export default {
  name: 'deepimg',
  aliases: ['generateimg', 'aiimg'],
  description: 'Generate images with AI! 🎨',
  usage: '.deepimg <prompt>',
  category: 'AI',
  async execute(sock, message, args) {
    const jid = getChatJid(message);
    
    if (args.length < 1) {
      await sock.sendMessage(jid.chat, { 
        text: `┏━━━━━━━━━━━━━━━━━━┓
┃  🎨 *DEEP IMAGE AI* 
┗━━━━━━━━━━━━━━━━━━┛

❌ *Missing prompt!*

📝 *Usage:* 
   ${config.bot.preffix}deepimg <prompt>

💡 *Examples:* 
   ${config.bot.preffix}deepimg A beautiful sunset over mountains
   ${config.bot.preffix}deepimg Futuristic city with flying cars

🎨 AI-powered image generation!`
      }, { quoted: message });
    }

    const prompt = args.join(' ');
    const apiUrl = `https://api.giftedtech.co.ke/api/ai/deepimg?apikey=gifted&prompt=${encodeURIComponent(prompt)}`;

    try {
      await sock.sendMessage(jid.chat, { 
        text: `┏━━━━━━━━━━━━━━━━━━┓
┃  🎨 *GENERATING IMAGE* 
┗━━━━━━━━━━━━━━━━━━┛

💭 *Prompt:* ${prompt}

🎨 AI is painting...
✨ Creating your image...
⏳ This may take 10-30 seconds...

_Please be patient!_ 🤖`
      }, { quoted: message });

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.success && data.result) {
        const caption = `┏━━━━━━━━━━━━━━━━━━┓
┃  🎨 *AI GENERATED IMAGE* 
┗━━━━━━━━━━━━━━━━━━┛

💭 *Prompt:*
${prompt}

━━━━━━━━━━━━━━━━━━
_Created by Deep Image AI_ 🎨`;

        await sock.sendMessage(jid.chat, {
          image: { url: data.result },
          caption: caption
        }, { quoted: message });
      } else {
        await sock.sendMessage(jid.chat, { 
          text: `❌ *Generation Failed!*

Unable to generate image. Try:
• Simpler prompts
• More descriptive details
• Retry in a moment`
        }, { quoted: message });
      }
    } catch (error) {
      console.error('Deep Image error:', error);
      await sock.sendMessage(jid.chat, { 
        text: `❌ *Error!* ${error.message}`
      }, { quoted: message });
    }
  }
};