// ===== dice.js =====
import config from '../config.js';

export default {
    name: 'dice',
    aliases: ['roll', 'rolldice'],
    description: 'Roll a dice',
    usage: '.dice [number]',
    category: 'Fun',
    
    async execute(sock, message, args) {
        const sender = message.key.remoteJid;
        
        const diceCount = parseInt(args[0]) || 1;
        if (diceCount > 10 || diceCount < 1) {
            return await sock.sendMessage(sender, { 
                text: '❌ Roll 1-10 dice only!' 
            });
        }
        
        const emojis = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
        let results = [];
        let total = 0;
        
        for (let i = 0; i < diceCount; i++) {
            const roll = Math.floor(Math.random() * 6) + 1;
            results.push(`${emojis[roll - 1]} ${roll}`);
            total += roll;
        }
        
        await sock.sendMessage(sender, { 
            text: `╭━━━『 🎲 DICE ROLL 』\n┃\n${results.map(r => `┃ ${r}`).join('\n')}\n┃\n┃ 🎯 Total: ${total}\n┃\n╰━━━━━━━━━━━━━━━⬣`
        });
    }
};
