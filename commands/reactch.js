import { getChatJid } from '../utils/jidHelper.js';
import config from '../config.js';

export default {
    name: 'reactch',
    aliases: ['channelreact', 'reactchannel', 'bombreact'],
    description: 'Send multiple reactions to WhatsApp channel posts',
    usage: '.reactch <channel-url> | <emojis>',
    category: 'Tools',
    ownerOnly: true,
    
    async execute(sock, message, args) {
        const jid = getChatJid(message);
        
        if (jid.senderNumber !== config.user.number) {
            return await sock.sendMessage(jid.chat, {
                text: '❌ Owner only command!'
            });
        }
        
        if (args.length < 1) {
            return await sock.sendMessage(jid.chat, {
                text: `❌ Usage: ${config.bot.defaultPrefix}reactch <url> | <emojis>\n\n` +
                      `Example:\n` +
                      `${config.bot.defaultPrefix}reactch https://whatsapp.com/channel/0029VbBf7pl3wtb4xfgsHh1P/100 | 😍🥺😂\n\n` +
                      `⚠️ Owner only command! NOTE: IT DSNT WORK I AM LOOKING FOR METHODS TO FIX IT `
            });
        }
        
        try {
            const input = args.join(' ');
            const [urlPart, emojiPart] = input.split('|').map(s => s.trim());
            
            if (!urlPart || !emojiPart) {
                throw new Error('Invalid format');
            }
            
            const urlMatch = urlPart.match(/channel\/([^\/]+)\/(\d+)/);
            if (!urlMatch) {
                throw new Error('Invalid URL format');
            }
            
            const channelId = urlMatch[1];
            const messageId = urlMatch[2];
            
            let emojis;
            if (emojiPart.includes(',')) {
                emojis = emojiPart.split(',').map(e => e.trim()).filter(e => e);
            } else {
                emojis = [...emojiPart.matchAll(/\p{Emoji}/gu)].map(match => match[0]);
            }
            
            if (emojis.length === 0) {
                throw new Error('No emojis provided');
            }
            
            const channelJid = `${channelId}@newsletter`;
            
            await sock.sendMessage(jid.chat, {
                text: `⏳ Sending ${emojis.length} reactions...\n\n` +
                      `Channel: ${channelId}\n` +
                      `Message: ${messageId}`
            });
            
            let successCount = 0;
            let failCount = 0;
            
            // Try using newsletterReaction if available
            for (const emoji of emojis) {
                try {
                    // Method 1: Try newsletterReaction (if Baileys supports it)
                    if (sock.newsletterReaction) {
                        await sock.newsletterReaction(channelJid, messageId, emoji);
                        console.log(`✅ newsletterReaction: ${emoji}`);
                    } 
                    // Method 2: Try sendMessage with newsletter-specific key
                    else {
                        await sock.sendMessage(channelJid, {
                            react: {
                                text: emoji,
                                key: {
                                    remoteJid: channelJid,
                                    fromMe: false,
                                    id: messageId
                                }
                            }
                        });
                        console.log(`✅ sendMessage react: ${emoji}`);
                    }
                    
                    successCount++;
                    await new Promise(resolve => setTimeout(resolve, 800));
                    
                } catch (err) {
                    console.error(`❌ Failed ${emoji}:`, err);
                    failCount++;
                }
            }
            
            await sock.sendMessage(jid.chat, {
                text: `✅ Completed!\n\n` +
                      `Success: ${successCount}\n` +
                      `Failed: ${failCount}\n` +
                      `Total: ${emojis.length}\n\n` +
                      `Check the channel now!`
            });
            
        } catch (error) {
            console.error('Error:', error);
            await sock.sendMessage(jid.chat, {
                text: `❌ Error: ${error.message}`
            });
        }
    }
};