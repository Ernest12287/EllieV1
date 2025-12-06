// encrypt.js
import config from '../config.js';
import logging from '../logger.js';
import { getChatJid } from '../utils/jidHelper.js';
export default {
    name: 'encrypt2', 
    aliases: ['obfuscate2', 'enc2'],
    description: 'Obfuscate JavaScript code (v2)',
    usage: '.encrypt2 <code>',
    category: 'Developer',
    
    async execute(sock, message, args) {
        const jid = getChatJid(message);
        
        if (args.length < 1) {
            await sock.sendMessage(jid.chat, { 
                text: `╭━━━『 🔒 CODE OBFUSCATOR 』\n┃\n┃ ❌ Usage: ${config.bot.preffix}encrypt <code>\n┃\n┃ 💡 Example:\n┃ ${config.bot.preffix}encrypt console.log("Hi")\n┃\n╰━━━━━━━━━━━━━━━⬣`
            });
        }

        try {
            await sock.sendMessage(jid.chat, { 
                text: '🔒 Obfuscating code...' 
            });

            const code = args.join(' ');
            const apiUrl = `https://api.giftedtech.co.ke/api/tools/encryptv2?apikey=gifted&code=${encodeURIComponent(code)}`;
            
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.success && data.encrypted_code) {
                await sock.sendMessage(jid.chat, { 
                    text: `╭━━━『 🔒 OBFUSCATED CODE 』\n┃\n┃ ✅ Code encrypted!\n┃\n╰━━━━━━━━━━━━━━━⬣`
                });
                
                await sock.sendMessage(jid.chat, { 
                    text: data.encrypted_code 
                });
                
                logging.success(`[ENCRYPT] Code obfuscated`);
            } else {
                await sock.sendMessage(jid.chat, { 
                    text: '❌ Failed to obfuscate code!' 
                });
            }

        } catch (error) {
            logging.error(`[ENCRYPT] Error: ${error.message}`);
            await sock.sendMessage(jid.chat, { 
                text: `❌ Error obfuscating!` 
            });
        }
    }
};