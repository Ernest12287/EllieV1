import config from '../config.js';
import { getChatJid } from '../utils/jidHelper.js';
export default {
  name: 'gpt4omini',
  aliases: ['gpt4mini', 'gptmini'],
  description: 'Chat with GPT-4o Mini AI! 🤖',
  usage: '.gpt4omini <question>',
  category: 'AI',
  async execute(sock, message, args) {
    const jid = getChatJid(message);
    
    if (args.length < 1) {
      await sock.sendMessage(jid.chat, { 
        text: `┏━━━━━━━━━━━━━━━━━━┓
┃  ⚡ *GPT-4o MINI* 
┗━━━━━━━━━━━━━━━━━━┛

❌ *Missing question!*

📝 *Usage:* 
   ${config.bot.preffix}gpt4omini <question>

💡 *Example:* 
   ${config.bot.preffix}gpt4omini Explain quantum physics

⚡ Fast & efficient AI responses!`
      }, { quoted: message });
    }

    const question = args.join(' ');
    const apiUrl = `https://api.giftedtech.co.ke/api/ai/gpt4o-mini?apikey=gifted&q=${encodeURIComponent(question)}`;

    try {
      await sock.sendMessage(jid.chat, { 
        text: `⚡ *Processing...*

💭 ${question}

_Thinking..._ 🤔`
      }, { quoted: message });

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.success && data.result) {
        await sock.sendMessage(jid.chat, { 
          text: `┏━━━━━━━━━━━━━━━━━━┓
┃  ⚡ *GPT-4o MINI* 
┗━━━━━━━━━━━━━━━━━━┛

${data.result}

━━━━━━━━━━━━━━━━━━
_Fast AI by OpenAI_ ⚡`
        }, { quoted: message });
      } else {
        await sock.sendMessage(jid.chat, { 
          text: `❌ *AI Error!* Unable to process.`
        }, { quoted: message });
      }
    } catch (error) {
      console.error('GPT-4o Mini error:', error);
      await sock.sendMessage(jid.chat, { 
        text: `❌ *Error!* ${error.message}`
      }, { quoted: message });
    }
  }
};