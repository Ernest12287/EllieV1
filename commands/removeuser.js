import { getChatJid } from '../utils/jidHelper.js';
import { removeContact } from '../utils/scheduler.js';
import config from '../config.js';




export const removeuserCommand = {
    name: 'removeuser',
    aliases: ['deleteuser', 'scheduleremove'],
    description: 'Remove user from scheduler',
    usage: '.removeuser <number>',
    category: 'Scheduler',
    
    async execute(sock, message, args) {
        const jid = getChatJid(message);
        
        if (args.length < 1) {
            await sock.sendMessage(jid.chat, {
                text: `╭━━━『 🗑️ REMOVE USER 』\n` +
                      `┃\n` +
                      `┃ ❌ Usage:\n` +
                      `┃ ${config.bot.defaultPrefix}removeuser <number>\n` +
                      `┃\n` +
                      `┃ 💡 Example:\n` +
                      `┃ ${config.bot.defaultPrefix}removeuser 254793859108\n` +
                      `┃\n` +
                      `╰━━━━━━━━━━━━━━━⬣`
            });
            return;
        }
        
        let number = args[0].replace(/[^0-9]/g, '');
        
        if (!number.startsWith('254') && number.length === 9) {
            number = '254' + number;
        }
        
        const result = removeContact(number);
        
        if (result.success) {
            await sock.sendMessage(jid.chat, {
                text: `╭━━━『 ✅ USER REMOVED 』\n` +
                      `┃\n` +
                      `┃ 📱 *Number:* +${number}\n` +
                      `┃ 🗑️ Removed from scheduler\n` +
                      `┃\n` +
                      `┃ They will no longer receive\n` +
                      `┃ automated messages.\n` +
                      `┃\n` +
                      `╰━━━━━━━━━━━━━━━⬣`
            });
        } else {
            await sock.sendMessage(jid.chat, {
                text: `❌ ${result.message}`
            });
        }
    }
};

export default {
    removeuser: removeuserCommand
};