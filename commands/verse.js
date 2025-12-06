import config from '../config.js';
import logging from '../logger.js';
import { getChatJid } from '../utils/jidHelper.js';
export default {
    name: 'verse',
    description: 'Get Bible verses',
    usage: '.verse <book> <chapter>:<verse>',
    category: 'Bible',
    
    async execute(sock, message, args) {
        const jid = getChatJid(message);
        
        if (args.length < 2) {
            await sock.sendMessage(jid.chat, {
                text: `❌ Usage: ${config.bot.preffix}verse <book> <chapter>:<verse>\n\n` +
                      `Examples:\n` +
                      `• ${config.bot.preffix}verse john 3:16\n` +
                      `• ${config.bot.preffix}verse john 3:16-18\n` +
                      `• ${config.bot.preffix}verse psalm 23:1-6`
            });
        }
        
        try {
            await sock.sendMessage(jid.chat, {
                text: '⏳ Fetching Bible verse...'
            });
            
            const book = args[0].toLowerCase();
            const passage = args[1];
            const [chapter, verses] = passage.split(':');
            
            let startVerse, endVerse;
            if (verses.includes('-')) {
                [startVerse, endVerse] = verses.split('-').map(v => parseInt(v));
            } else {
                startVerse = parseInt(verses);
                endVerse = startVerse;
            }
            
            // Try primary API with timeout
            const apiUrl = `https://bible-api.com/${book}+${chapter}:${startVerse}-${endVerse}?translation=kjv`;
            
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 10000); // 10 second timeout
            
            try {
                const response = await fetch(apiUrl, {
                    signal: controller.signal
                });
                clearTimeout(timeout);
                
                if (!response.ok) throw new Error('API response not OK');
                
                const data = await response.json();
                
                if (data.verses && data.verses.length > 0) {
                    let messageText = `📖 *${data.reference}*\n`;
                    messageText += `_${data.translation_name}_\n\n`;
                    
                    data.verses.forEach(verse => {
                        messageText += `${verse.verse}. ${verse.text}\n\n`;
                    });
                    
                    // Split if too long
                    if (messageText.length > 3500) {
                        const parts = this._splitText(messageText, 3500);
                        for (let i = 0; i < parts.length; i++) {
                            await sock.sendMessage(jid.chat, {
                                text: parts[i] + (parts.length > 1 ? `\n\n📄 ${i + 1}/${parts.length}` : '')
                            });
                        }
                    } else {
                        await sock.sendMessage(jid.chat, { text: messageText });
                    }
                    
                    logging.success(`[VERSE] Sent: ${data.reference}`);
                    return;
                }
                
            } catch (fetchError) {
                clearTimeout(timeout);
                
                if (fetchError.name === 'AbortError') {
                    throw new Error('Request timeout - API is taking too long to respond');
                }
                throw fetchError;
            }
            
            // If we get here, no data was found
            await sock.sendMessage(jid.chat, {
                text: '❌ Verse not found. Please check the book and verse reference.'
            });
            
        } catch (error) {
            logging.error(`[VERSE] Error: ${error.message}`);
            
            // Provide manual search link
            const searchQuery = `${args[0]} ${args[1]} bible`;
            const fallbackText = `❌ *Error fetching verse*\n\n` +
                               `${error.message}\n\n` +
                               `🔍 *Search manually:*\n` +
                               `https://www.biblegateway.com/passage/?search=${encodeURIComponent(searchQuery)}&version=KJV`;
            
            await sock.sendMessage(jid.chat, { text: fallbackText });
        }
    },
    
    _splitText(text, maxLength) {
        const parts = [];
        let current = '';
        const lines = text.split('\n');
        
        for (const line of lines) {
            if ((current + line + '\n').length > maxLength) {
                if (current) parts.push(current.trim());
                current = line + '\n';
            } else {
                current += line + '\n';
            }
        }
        
        if (current.trim()) parts.push(current.trim());
        return parts;
    }
};