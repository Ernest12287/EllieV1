import config from '../config.js';
import logging from '../logger.js';
import { getChatJid } from '../utils/jidHelper.js';
export default {
    name: 'wwdgpt',
    aliases: ['indonesianai', 'idai'],
    description: 'Indonesian AI chatbot',
    usage: '.wwdgpt <question>',
    category: 'AI',
    
    async execute(sock, message, args) {
        const jid = getChatJid(message);
        
        if (args.length < 1) {
            await sock.sendMessage(jid.chat, { 
                text: `╭━━━『 🤖 INDONESIAN AI 』\n┃\n┃ ❌ Usage: ${config.bot.preffix}wwdgpt <pertanyaan>\n┃\n┃ 💡 Contoh:\n┃ ${config.bot.preffix}wwdgpt Apa kabar?\n┃ ${config.bot.preffix}wwdgpt Siapa presiden Indonesia?\n┃\n┃ 🌏 Bahasa: Indonesia\n┃\n╰━━━━━━━━━━━━━━━⬣`
            });
        }

        try {
            await sock.sendMessage(jid.chat, { 
                text: '🤖 Berpikir...' 
            });

            const question = args.join(' ');
            const apiUrl = `https://api.giftedtech.co.ke/api/ai/wwdgpt?apikey=gifted&q=${encodeURIComponent(question)}`;
            
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.success && data.result) {
                const aiText = `╭━━━『 🤖 WWD GPT 』\n┃\n┃ ❓ *Pertanyaan:*\n┃ ${question}\n┃\n┃━━━━━━━━━━━━━━\n┃\n┃ 💡 *Jawaban:*\n┃ ${data.result}\n┃\n╰━━━━━━━━━━━━━━━⬣\n\n_${config.bot.name}_`;
                
                await sock.sendMessage(jid.chat, { text: aiText });
                logging.success(`[WWDGPT] Responded to Indonesian query`);
            } else {
                await sock.sendMessage(jid.chat, { 
                    text: '❌ Gagal mendapatkan jawaban!' 
                });
            }

        } catch (error) {
            logging.error(`[WWDGPT] Error: ${error.message}`);
            await sock.sendMessage(jid.chat, { 
                text: `❌ Terjadi kesalahan!` 
            });
        }
    }
};