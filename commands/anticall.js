// ============================================
// ANTICALL.JS COMMAND
// ============================================

import { getChatJid } from '../utils/jidHelper.js';
import { toggleAnticall, toggleAnticallMessage, getAnticallStatus } from '../Handlers/anticallHandler.js';
import config from '../config.js';

export default {
    name: 'anticall',
    aliases: ['rejectcalls', 'blockcalls'],
    description: 'Auto-reject incoming calls',
    usage: '.anticall [on/off/status]',
    category: 'Settings',
    
    async execute(sock, message, args) {
        const jid = getChatJid(message);
        
        if (args.length === 0) {
            const status = getAnticallStatus();
            
            await sock.sendMessage(jid.chat, {
                text: `╭━━━『 📞 ANTICALL STATUS 』\n` +
                      `┃\n` +
                      `┃ 🔴 *Enabled:* ${status.enabled ? '✅ Yes' : '❌ No'}\n` +
                      `┃ 💬 *Auto-reply:* ${status.sendMessage ? '✅ Yes' : '❌ No'}\n` +
                      `┃\n` +
                      `┃ 💡 *Commands:*\n` +
                      `┃ ${config.bot.defaultPrefix}anticall on - Enable\n` +
                      `┃ ${config.bot.defaultPrefix}anticall off - Disable\n` +
                      `┃ ${config.bot.defaultPrefix}anticall msg - Toggle message\n` +
                      `┃\n` +
                      `╰━━━━━━━━━━━━━━━⬣`
            });
            return;
        }
        
        const action = args[0].toLowerCase();
        
        switch (action) {
            case 'on':
            case 'enable':
                toggleAnticall();
                await sock.sendMessage(jid.chat, {
                    text: `╭━━━『 ✅ ANTICALL ENABLED 』\n` +
                          `┃\n` +
                          `┃ 📞 All incoming calls will be\n` +
                          `┃    automatically rejected\n` +
                          `┃\n` +
                          `┃ 💬 Auto-reply message will be sent\n` +
                          `┃\n` +
                          `╰━━━━━━━━━━━━━━━⬣`
                });
                break;
                
            case 'off':
            case 'disable':
                toggleAnticall();
                await sock.sendMessage(jid.chat, {
                    text: `╭━━━『 ❌ ANTICALL DISABLED 』\n` +
                          `┃\n` +
                          `┃ 📞 Calls will now go through\n` +
                          `┃    normally\n` +
                          `┃\n` +
                          `╰━━━━━━━━━━━━━━━⬣`
                });
                break;
                
            case 'msg':
            case 'message':
                const msgEnabled = toggleAnticallMessage();
                await sock.sendMessage(jid.chat, {
                    text: `╭━━━『 💬 AUTO-REPLY 』\n` +
                          `┃\n` +
                          `┃ ${msgEnabled ? '✅ Enabled' : '❌ Disabled'}\n` +
                          `┃\n` +
                          `┃ ${msgEnabled ? 'Callers will receive a message' : 'Calls will be rejected silently'}\n` +
                          `┃\n` +
                          `╰━━━━━━━━━━━━━━━⬣`
                });
                break;
                
            default:
                await sock.sendMessage(jid.chat, {
                    text: `❌ Invalid option: ${action}\n\n` +
                          `Use: on, off, or msg`
                });
                break;
        }
    }
};

