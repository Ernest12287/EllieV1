import config from '../config.js';
import logging from '../logger.js';
import { getChatJid } from '../utils/jidHelper.js';
export default {
    name: 'translate',
    aliases: ['tr', 'trans'],
    description: 'Translate text to any language',
    usage: '.translate <lang> <text>',
    category: 'Utility',
    
    async execute(sock, message, args) {
        const jid = getChatJid(message);
        
        if (args.length < 2) {
            await sock.sendMessage(jid.chat, { 
                text: `╭━━━『 🌍 TRANSLATOR 』\n┃\n┃ ❌ Usage: ${config.bot.preffix}translate <lang> <text>\n┃\n┃ 💡 Examples:\n┃ ${config.bot.preffix}translate es Hello World\n┃ ${config.bot.preffix}translate fr Good morning\n┃ ${config.bot.preffix}translate ja I love anime\n┃\n┃ 🗣️ Popular codes:\n┃ en (English), es (Spanish)\n┃ fr (French), de (German)\n┃ ja (Japanese), ko (Korean)\n┃ zh (Chinese), ar (Arabic)\n┃\n╰━━━━━━━━━━━━━━━⬣`
            });
        }

        try {
            await sock.sendMessage(jid.chat, { 
                text: '🌍 Translating...' 
            });

            const targetLang = args[0].toLowerCase();
            const text = args.slice(1).join(' ');
            
            // Using LibreTranslate API (free)
            const apiUrl = 'https://libretranslate.com/translate';
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    q: text,
                    source: 'auto',
                    target: targetLang,
                    format: 'text'
                })
            });
            
            const data = await response.json();

            if (data && data.translatedText) {
                const translateText = `╭━━━『 🌍 TRANSLATION 』\n┃\n┃ 📝 *Original:*\n┃ ${text}\n┃\n┃━━━━━━━━━━━━━━\n┃\n┃ 🌐 *Translated (${targetLang}):*\n┃ ${data.translatedText}\n┃\n╰━━━━━━━━━━━━━━━⬣\n\n_${config.bot.name}_`;
                
                await sock.sendMessage(jid.chat, { text: translateText });
                logging.success(`[TRANSLATE] Translated to: ${targetLang}`);
            } else {
                await sock.sendMessage(jid.chat, { 
                    text: `❌ Translation failed!\n\n💡 Check language code and try again.` 
                });
            }

        } catch (error) {
            logging.error(`[TRANSLATE] Error: ${error.message}`);
            await sock.sendMessage(jid.chat, { 
                text: '❌ Translation service unavailable.' 
            });
        }
    }
};