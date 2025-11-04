import config from '../config.js';
import logging from '../logger.js';

export default {
    name: 'gemini',
    description: 'Chat with Google Gemini AI',
    usage: '.gemini <question>',
    category: 'AI',
    
    async execute(sock, message, args) {
        const sender = message.key.remoteJid;
        
        if (!args.length) {
            return await sock.sendMessage(sender, {
                text: `❌ Please provide a question.\n💡 Usage: ${config.bot.preffix}gemini <your question>`
            });
        }
        
        const question = args.join(' ');
        
        try {
            await sock.sendMessage(sender, { text: '🔮 Gemini is thinking...' });
            
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${config.apikeys.gemini}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: question }] }],
                        generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
                    })
                }
            );
            
            const data = await response.json();
            
            if (!response.ok) throw new Error(data.error?.message || 'API failed');
            
            const aiResponse = data.candidates[0]?.content?.parts[0]?.text;
            
            if (!aiResponse) throw new Error('No response from Gemini');
            
            await sock.sendMessage(sender, {
                text: `🤖 *Google Gemini*\n\n${aiResponse}\n\n━━━━━━━━━━━━━━\n_${config.bot.name}_`
            });
            
            logging.success(`[GEMINI] Response sent to ${sender}`);
            
        } catch (error) {
            logging.error(`[GEMINI] Error: ${error.message}`);
            await sock.sendMessage(sender, {
                text: `❌ *Gemini Error*\n\n${error.message}\n\n_Please try again or check your API key._`
            });
        }
    }
};