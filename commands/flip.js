// ===== flip.js =====
import config from '../config.js';
import { getChatJid } from '../utils/jidHelper.js';
export default {
    name: 'flip',
    aliases: ['coin', 'coinflip'],
    description: 'Flip a coin',
    usage: '.flip',
    category: 'Fun',
    
    async execute(sock, message, args) {
        const jid = getChatJid(message);
        
        const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
        const emoji = result === 'Heads' ? '🪙' : '🎯';
        
        await sock.sendMessage(jid.chat, { 
            text: `╭━━━『 🪙 COIN FLIP 』\n┃\n┃ ${emoji} *${result.toUpperCase()}*\n┃\n╰━━━━━━━━━━━━━━━⬣`
        });
    }
};
