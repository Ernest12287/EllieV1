// ===== trivia.js =====
import config from '../config.js';
import logging from '../logger.js';
import { getChatJid } from '../utils/jidHelper.js';
export default {
    name: 'trivia',
    aliases: ['quiz'],
    description: 'Get a random trivia question',
    usage: '.trivia',
    category: 'Fun',
    
    async execute(sock, message, args) {
        const sender = getChatJid(message);
        
        try {
            const apiUrl = 'https://opentdb.com/api.php?amount=1&type=multiple';
            const response = await fetch(apiUrl);
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
                const q = data.results[0];
                const answers = [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5);
                
                let triviaText = `╭━━━『 🧠 TRIVIA 』\n┃\n┃ 📚 Category: ${q.category}\n┃ 🎯 Difficulty: ${q.difficulty}\n┃\n┃━━━━━━━━━━━━━━\n┃\n┃ ❓ ${q.question}\n┃\n`;
                
                answers.forEach((ans, i) => {
                    triviaText += `┃ ${i + 1}. ${ans}\n`;
                });
                
                triviaText += `┃\n╰━━━━━━━━━━━━━━━⬣\n\n✅ Answer: ||${q.correct_answer}||`;
                
                await sock.sendMessage(jid.chat, { text: triviaText });
                logging.success('[TRIVIA] Question sent');
            } else {
                await sock.sendMessage(jid.chat, { text: '❌ Failed to get trivia!' });
            }
        } catch (error) {
            logging.error(`[TRIVIA] Error: ${error.message}`);
            await sock.sendMessage(jid.chat, { text: '❌ Error!' });
        }
    }
};
