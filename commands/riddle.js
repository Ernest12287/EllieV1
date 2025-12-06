import config from '../config.js';
import { getChatJid } from '../utils/jidHelper.js';
export default {
    name: 'riddle',
    description: 'Get a random riddle',
    usage: '.riddle',
    category: 'Fun',
    
    async execute(sock, message, args) {
        const jid = getChatJid(message);
        
        const riddles = [
            { q: 'What has keys but no locks?', a: 'A keyboard' },
            { q: 'What gets wet while drying?', a: 'A towel' },
            { q: 'What can travel around the world while staying in a corner?', a: 'A stamp' },
            { q: 'What has hands but cannot clap?', a: 'A clock' },
            { q: 'What has a head and tail but no body?', a: 'A coin' },
            { q: 'What goes up but never comes down?', a: 'Your age' },
            { q: 'What has many teeth but cannot bite?', a: 'A comb' },
            { q: 'What can you break without touching it?', a: 'A promise' }
        ];
        
        const riddle = riddles[Math.floor(Math.random() * riddles.length)];
        
        await sock.sendMessage(jid.chat, { 
            text: `╭━━━『 🤯 RIDDLE 』\n┃\n┃ ${riddle.q}\n┃\n╰━━━━━━━━━━━━━━━⬣\n\n💡 Answer: ||${riddle.a}||`
        });
    }
};