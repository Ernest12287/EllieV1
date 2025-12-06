// ============================================
// CHAPTER.JS - Fixed Bible Chapter Command
// ============================================
export const chapterCommand = {
    name: 'chapter',
    description: 'Get full Bible chapters',
    usage: '.chapter <book> <chapter>',
    category: 'Bible',
    
    async execute(sock, message, args) {
        const jid = getChatJid(message);
        
        if (args.length < 2) {
            await sock.sendMessage(jid.chat, {
                text: `❌ Usage: ${config.bot.preffix}chapter <book> <chapter>\n\n` +
                      `Examples:\n` +
                      `• ${config.bot.preffix}chapter john 3\n` +
                      `• ${config.bot.preffix}chapter psalm 23`
            });
        }
        
        try {
            await sock.sendMessage(jid.chat, {
                text: '⏳ Fetching Bible chapter...'
            });
            
            const book = args[0].toLowerCase();
            const chapter = args[1];
            const apiUrl = `https://bible-api.com/${book}+${chapter}?translation=kjv`;
            
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 15000); // 15 second timeout
            
            try {
                const response = await fetch(apiUrl, {
                    signal: controller.signal
                });
                clearTimeout(timeout);
                
                if (!response.ok) throw new Error('API response not OK');
                
                const data = await response.json();
                
                if (data.verses && data.verses.length > 0) {
                    let fullText = `📖 *${data.reference}*\n`;
                    fullText += `_${data.translation_name}_\n\n`;
                    
                    data.verses.forEach(verse => {
                        fullText += `${verse.verse}. ${verse.text}\n\n`;
                    });
                    
                    // Split into messages
                    const messages = this._splitChapter(fullText, 3500);
                    
                    for (let i = 0; i < messages.length; i++) {
                        await sock.sendMessage(jid.chat, {
                            text: messages[i] + (messages.length > 1 ? `\n\n📄 Page ${i + 1}/${messages.length}` : '')
                        });
                    }
                    
                    logging.success(`[CHAPTER] Sent: ${data.reference}`);
                    return;
                }
                
            } catch (fetchError) {
                clearTimeout(timeout);
                
                if (fetchError.name === 'AbortError') {
                    throw new Error('Request timeout - API is taking too long to respond');
                }
                throw fetchError;
            }
            
            await sock.sendMessage(jid.chat, {
                text: '❌ Chapter not found. Please check the book and chapter.'
            });
            
        } catch (error) {
            logging.error(`[CHAPTER] Error: ${error.message}`);
            
            const searchQuery = `${args[0]} ${args[1]} bible`;
            const fallbackText = `❌ *Error fetching chapter*\n\n` +
                               `${error.message}\n\n` +
                               `🔍 *Read online:*\n` +
                               `https://www.biblegateway.com/passage/?search=${encodeURIComponent(searchQuery)}&version=KJV`;
            
            await sock.sendMessage(jid.chat, { text: fallbackText });
        }
    },
    
    _splitChapter(text, maxLength) {
        const messages = [];
        let current = '';
        const lines = text.split('\n');
        
        for (const line of lines) {
            if ((current + line + '\n').length > maxLength) {
                if (current) messages.push(current.trim());
                current = line + '\n';
            } else {
                current += line + '\n';
            }
        }
        
        if (current.trim()) messages.push(current.trim());
        return messages;
    }
};