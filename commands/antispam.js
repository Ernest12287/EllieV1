// ============================================
// ANTISPAM.JS COMMAND
// ============================================

import { getChatJid } from '../utils/jidHelper.js';
import { 
    toggleAntispam, 
    toggleAntispamBlock, 
    getAntispamStatus, 
    getBlockedSpammers,
    unblockSpammer 
} from '../Handlers/antispamHandler.js';
import config from '../config.js';

export default {
    name: 'antispam',
    aliases: ['blockfiles', 'antivirus'],
    description: 'Block spam files (.zip, .rar, etc)',
    usage: '.antispam [on/off/status/blocked]',
    category: 'Settings',
    
    async execute(sock, message, args) {
        const jid = getChatJid(message);
        
        if (args.length === 0) {
            const status = getAntispamStatus();
            
            await sock.sendMessage(jid.chat, {
                text: `╭━━━『 🛡️ ANTISPAM STATUS 』\n` +
                      `┃\n` +
                      `┃ 🔴 *Enabled:* ${status.enabled ? '✅ Yes' : '❌ No'}\n` +
                      `┃ 🚫 *Block Sender:* ${status.blockSender ? '✅ Yes' : '❌ No'}\n` +
                      `┃ 🗑️ *Delete Files:* ${status.deleteMessage ? '✅ Yes' : '❌ No'}\n` +
                      `┃\n` +
                      `┃ 📂 *Blocked Extensions:*\n` +
                      `┃ ${status.blockedExtensions.join(', ')}\n` +
                      `┃\n` +
                      `┃ 💡 *Commands:*\n` +
                      `┃ ${config.bot.defaultPrefix}antispam on - Enable\n` +
                      `┃ ${config.bot.defaultPrefix}antispam off - Disable\n` +
                      `┃ ${config.bot.defaultPrefix}antispam block - Toggle blocking\n` +
                      `┃ ${config.bot.defaultPrefix}antispam blocked - View blocked\n` +
                      `┃\n` +
                      `╰━━━━━━━━━━━━━━━⬣`
            });
            return;
        }
        
        const action = args[0].toLowerCase();
        
        switch (action) {
            case 'on':
            case 'enable':
                toggleAntispam();
                await sock.sendMessage(jid.chat, {
                    text: `╭━━━『 ✅ ANTISPAM ENABLED 』\n` +
                          `┃\n` +
                          `┃ 🛡️ Spam files will be blocked\n` +
                          `┃ 📂 Extensions: .zip, .rar, .7z, .apk\n` +
                          `┃ 🗑️ Messages will be deleted\n` +
                          `┃ 🚫 Senders will be blocked\n` +
                          `┃\n` +
                          `╰━━━━━━━━━━━━━━━⬣`
                });
                break;
                
            case 'off':
            case 'disable':
                toggleAntispam();
                await sock.sendMessage(jid.chat, {
                    text: `╭━━━『 ❌ ANTISPAM DISABLED 』\n` +
                          `┃\n` +
                          `┃ 🛡️ Spam protection is now OFF\n` +
                          `┃ ⚠️ All files will be allowed\n` +
                          `┃\n` +
                          `╰━━━━━━━━━━━━━━━⬣`
                });
                break;
                
            case 'block':
            case 'blocking':
                const blockEnabled = toggleAntispamBlock();
                await sock.sendMessage(jid.chat, {
                    text: `╭━━━『 🚫 SENDER BLOCKING 』\n` +
                          `┃\n` +
                          `┃ ${blockEnabled ? '✅ Enabled' : '❌ Disabled'}\n` +
                          `┃\n` +
                          `┃ ${blockEnabled ? 'Spammers will be auto-blocked' : 'Files deleted, no blocking'}\n` +
                          `┃\n` +
                          `╰━━━━━━━━━━━━━━━⬣`
                });
                break;
                
            case 'blocked':
            case 'list':
                const blocked = getBlockedSpammers();
                
                if (blocked.length === 0) {
                    await sock.sendMessage(jid.chat, {
                        text: `╭━━━『 📋 BLOCKED SPAMMERS 』\n` +
                              `┃\n` +
                              `┃ ✅ No users blocked yet\n` +
                              `┃\n` +
                              `╰━━━━━━━━━━━━━━━⬣`
                    });
                    return;
                }
                
                let blockedText = `╭━━━『 📋 BLOCKED SPAMMERS 』\n┃\n`;
                blockedText += `┃ 🚫 *Total:* ${blocked.length}\n┃\n`;
                
                blocked.forEach((user, index) => {
                    const number = user.jid.split('@')[0];
                    blockedText += `┃ ${index + 1}. +${number}\n`;
                    blockedText += `┃    📂 ${user.reason}\n`;
                    blockedText += `┃    📅 ${new Date(user.blockedAt).toLocaleDateString()}\n`;
                    blockedText += `┃\n`;
                });
                
                blockedText += `┃ 💡 To unblock:\n`;
                blockedText += `┃ ${config.bot.defaultPrefix}antispam unblock <number>\n`;
                blockedText += `┃\n`;
                blockedText += `╰━━━━━━━━━━━━━━━⬣`;
                
                await sock.sendMessage(jid.chat, { text: blockedText });
                break;
                
            case 'unblock':
                if (args.length < 2) {
                    await sock.sendMessage(jid.chat, {
                        text: `❌ Usage: ${config.bot.defaultPrefix}antispam unblock <number>`
                    });
                    return;
                }
                
                let number = args[1].replace(/[^0-9]/g, '');
                if (!number.startsWith('254') && number.length === 9) {
                    number = '254' + number;
                }
                
                const jidToUnblock = number + '@s.whatsapp.net';
                const unblocked = unblockSpammer(jidToUnblock);
                
                if (unblocked) {
                    try {
                        await sock.updateBlockStatus(jidToUnblock, 'unblock');
                        await sock.sendMessage(jid.chat, {
                            text: `╭━━━『 ✅ UNBLOCKED 』\n` +
                                  `┃\n` +
                                  `┃ 📱 +${number}\n` +
                                  `┃ ✅ User has been unblocked\n` +
                                  `┃\n` +
                                  `╰━━━━━━━━━━━━━━━⬣`
                        });
                    } catch (error) {
                        await sock.sendMessage(jid.chat, {
                            text: `❌ Failed to unblock: ${error.message}`
                        });
                    }
                } else {
                    await sock.sendMessage(jid.chat, {
                        text: `❌ User not found in blocked list`
                    });
                }
                break;
                
            default:
                await sock.sendMessage(jid.chat, {
                    text: `❌ Invalid option: ${action}\n\n` +
                          `Use: on, off, block, blocked, or unblock`
                });
                break;
        }
    }
};