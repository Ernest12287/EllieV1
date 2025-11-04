import config from '../config.js';

export default {
    name: 'ping',
    description: 'Check bot response time',
    usage: '.ping',
    category: 'General',
    
    async execute(sock, message) {
        const sender = message.key.remoteJid;
        const start = Date.now();
        
        await sock.sendMessage(sender, { text: '🏓 Pong!' });
        
        const latency = Date.now() - start;
        await sock.sendMessage(sender, { 
            text: `⚡ Response time: ${latency}ms` 
        });
    }
};