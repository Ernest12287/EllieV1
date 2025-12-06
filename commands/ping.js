import config from '../config.js';
import { getChatJid } from '../utils/jidHelper.js';
export default {
    name: 'ping',
    description: 'Check bot response time',
    usage: '.ping',
    category: 'General',
    
    async execute(sock, message) {
        const jid = getChatJid(message);
        const start = Date.now();
        
        await sock.sendMessage(jid.chat, { text: '🏓 Pong!' });
        
        const latency = Date.now() - start;
        await sock.sendMessage(jid.chat, { 
            text: `⚡ Response time: ${latency}ms` 
        });
    }
};