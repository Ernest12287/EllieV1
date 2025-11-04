import config from '../config.js';
import logging from '../logger.js';

export default {
    name: 'groq',
    description: 'Chat with Groq AI (Ultra Fast - Llama 3)',
    usage: '.groq <question>',
    category: 'AI',
    aliases: ['ai', 'llama'],
    
    async execute(sock, message, args) {
        const sender = message.key.remoteJid;
        
        if (!args.length) {
            return await sock.sendMessage(sender, { 
                text: `❌ Please provide a question.\n💡 Usage: ${config.bot.preffix}groq <your question>` 
            });
        }

        const question = args.join(' ');
        
        try {
            await sock.sendMessage(sender, { text: '⚡ Groq AI is thinking...' });
            
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.apikeys.groq}`
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        { role: "system", content: "You are a helpful AI assistant." },
                        { role: "user", content: question }
                    ],
                    temperature: 0.7,
                    max_tokens: 1024
                })
            });

            const data = await response.json();
            
            if (!response.ok) throw new Error(data.error?.message || 'API failed');
            
            const aiResponse = data.choices[0]?.message?.content;
            if (!aiResponse) throw new Error('No response');
            
            await sock.sendMessage(sender, { 
                text: `🤖 *Groq AI*\n\n${aiResponse}\n\n━━━━━━━━━━━━━━\n_${config.bot.name}_`
            });
            
            logging.success(`[GROQ] Response sent`);
            
        } catch (error) {
            logging.error(`[GROQ] Error: ${error.message}`);
            await sock.sendMessage(sender, { 
                text: `❌ Groq AI unavailable.\n\n💡 Try: ${config.bot.preffix}gemini <question>` 
            });
        }
    }
};