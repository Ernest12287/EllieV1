import config from '../config.js';

export default {
  name: 'gpt4o',
  aliases: ['gpt4', 'chatgpt4'],
  description: 'Chat with GPT-4o AI! 🤖',
  usage: '.gpt4o <question>',
  category: 'AI',
  async execute(sock, message, args) {
    const sender = message.key.remoteJid;
    
    if (args.length < 1) {
      return await sock.sendMessage(sender, { 
        text: `┏━━━━━━━━━━━━━━━━━━┓
┃  🤖 *GPT-4o AI* 
┗━━━━━━━━━━━━━━━━━━┛

❌ *Missing question!*

📝 *Usage:* 
   ${config.bot.preffix}gpt4o <question>

💡 *Example:* 
   ${config.bot.preffix}gpt4o What is artificial intelligence?

🧠 Powered by OpenAI GPT-4o!`
      }, { quoted: message });
    }

    const question = args.join(' ');
    const apiUrl = `https://api.giftedtech.co.ke/api/ai/gpt4o?apikey=gifted&q=${encodeURIComponent(question)}`;

    try {
      await sock.sendMessage(sender, { 
        text: `┏━━━━━━━━━━━━━━━━━━┓
┃  🤖 *GPT-4o THINKING...* 
┗━━━━━━━━━━━━━━━━━━┛

💭 *Processing your question...*
🧠 AI is analyzing...
⚡ Generating response...

_Please wait!_ ✨`
      }, { quoted: message });

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.success && data.result) {
        await sock.sendMessage(sender, { 
          text: `┏━━━━━━━━━━━━━━━━━━┓
┃  🤖 *GPT-4o RESPONSE* 
┗━━━━━━━━━━━━━━━━━━┛

❓ *Question:*
${question}

━━━━━━━━━━━━━━━━━━

💡 *Answer:*

${data.result}

━━━━━━━━━━━━━━━━━━
_Powered by OpenAI GPT-4o_ 🧠`
        }, { quoted: message });
      } else {
        await sock.sendMessage(sender, { 
          text: `❌ *AI Error!*

Unable to get response from GPT-4o.
Please try again!`
        }, { quoted: message });
      }
    } catch (error) {
      console.error('GPT-4o error:', error);
      await sock.sendMessage(sender, { 
        text: `❌ *Error!* ${error.message}`
      }, { quoted: message });
    }
  }
};