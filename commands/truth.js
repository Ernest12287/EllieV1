// ===== truth.js =====
import config from '../config.js';
import { getChatJid } from '../utils/jidHelper.js';
export default {
    name: 'truth',
    description: 'Get a random truth question',
    usage: '.truth',
    category: 'Fun',
    
    async execute(sock, message, args) {
        const jid = getChatJid(message);
        
        const truths = [
            'What is your biggest secret?',
            'Have you ever lied to your best friend?',
            'What is your biggest fear?',
            'Who was your first crush?',
            'What is the most embarrassing thing you\'ve done?',
            'Have you ever cheated on a test?',
            'What is your biggest regret?',
            'What do you think about me?',
            'What is something you\'ve never told anyone?',
            'Who do you have a crush on right now?'
        ];
        
        const truth = truths[Math.floor(Math.random() * truths.length)];
        
        await sock.sendMessage(jid.chat, { 
            text: `╭━━━『 🤔 TRUTH 』\n┃\n┃ ${truth}\n┃\n╰━━━━━━━━━━━━━━━⬣`
        });
    }
};



