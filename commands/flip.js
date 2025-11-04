// ===== flip.js =====
import config from '../config.js';

export default {
    name: 'flip',
    aliases: ['coin', 'coinflip'],
    description: 'Flip a coin',
    usage: '.flip',
    category: 'Fun',
    
    async execute(sock, message, args) {
        const sender = message.key.remoteJid;
        
        const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
        const emoji = result === 'Heads' ? '🪙' : '🎯';
        
        await sock.sendMessage(sender, { 
            text: `╭━━━『 🪙 COIN FLIP 』\n┃\n┃ ${emoji} *${result.toUpperCase()}*\n┃\n╰━━━━━━━━━━━━━━━⬣`
        });
    }
};
