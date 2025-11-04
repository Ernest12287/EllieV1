import config from '../config.js';

export default {
  name: 'gpt',
  aliases: ['chatgpt', 'ai'],
  description: 'Chat with GPT AI! 🤖',
  usage: '.gpt <question>',
  category: 'AI',
  async execute(sock, message, args) {
    const sender = message.key.remoteJid;
    
    if (args.length < 1) {
      return await sock.sendMessage(sender, { 
        text: `┏━━━━━━━━━━━━━━━━━━┓
┃  🤖 *CHATGPT AI* 
┗━━━━━━━━━━━━━━━━━━┛

❌ *Missing question!*

📝 *Usage:* 
   ${config.bot.preffix}gpt <question>

💡 *Examples:* 
   ${config.bot.preffix}gpt Write a poem
   ${config.bot.preffix}gpt Explain blockchain

🧠 Ask me anything!`
      }, { quoted: message });
    }

    const question = args.join(' ');
    const apiUrl = `https://api.giftedtech.co.ke/api/ai/gpt?apikey=gifted&q=${encodeURIComponent(question)}`;

    try {
      await sock.sendMessage(sender, { 
        text: `🤖 *ChatGPT is thinking...*

💭 "${question}"

⏳ Generating response...`
      }, { quoted: message });

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.success && data.result) {
        await sock.sendMessage(sender, { 
          text: `┏━━━━━━━━━━━━━━━━━━┓
┃  🤖 *CHATGPT* 
┗━━━━━━━━━━━━━━━━━━┛

${data.result}

━━━━━━━━━━━━━━━━━━
_AI Assistant by OpenAI_ 🧠`
        }, { quoted: message });
      } else {
        await sock.sendMessage(sender, { 
          text: `❌ *Failed to get AI response!*`
        }, { quoted: message });
      }
    } catch (error) {
      console.error('GPT error:', error);
      await sock.sendMessage(sender, { 
        text: `❌ *Error!* ${error.message}`
      }, { quoted: message });
    }
  }
};