import config from '../config.js';
import { getChatJid } from '../utils/jidHelper.js';
export default {
    name: 'qr',
    description: 'Generate QR codes',
    usage: '.qr <text or url>',
    category: 'Utility',
    
    async execute(sock, message, args) {
        const jid = getChatJid(message);
        
        if (args.length < 1) {
            await sock.sendMessage(jid.chat, { 
                text: `❌ Usage: ${config.bot.preffix}qr <text or url>\n\nExamples:\n• ${config.bot.preffix}qr "Hello World"\n• ${config.bot.preffix}qr "https://google.com"\n• ${config.bot.preffix}qr "WIFI:S:MyNetwork;T:WPA;P:MyPassword;;"`
            });
        }

        try {
            await sock.sendMessage(jid.chat, { 
                text: '⏳ Generating QR code...' 
            });

            const text = args.join(' ');
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}`;
            
            await sock.sendMessage(jid.chat, {
                image: { url: qrUrl },
                caption: `📱 QR Code for: ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}`
            });

        } catch (error) {
            console.error('QR error:', error);
            await sock.sendMessage(jid.chat, { 
                text: '❌ Error generating QR code.' 
            });
        }
    }
};