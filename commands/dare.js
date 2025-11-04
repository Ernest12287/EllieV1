// ===== dare.js =====
import config from '../config.js';

export default {
    name: 'dare',
    description: 'Get a random dare challenge',
    usage: '.dare',
    category: 'Fun',
    
    async execute(sock, message, args) {
        const sender = message.key.remoteJid;
        
        const dares = [
            'Send a voice message singing a song',
            'Change your status to something embarrassing for 1 hour',
            'Send a funny selfie',
            'Text your crush',
            'Do 20 pushups and send a video',
            'Share your most embarrassing photo',
            'Call someone random and say "I love you"',
            'Dance for 1 minute and record it',
            'Post an embarrassing story on your status',
            'Send "I miss you" to someone random'
        ];
        
        const dare = dares[Math.floor(Math.random() * dares.length)];
        
        await sock.sendMessage(sender, { 
            text: `╭━━━『 😈 DARE 』\n┃\n┃ ${dare}\n┃\n╰━━━━━━━━━━━━━━━⬣`
        });
    }
};
