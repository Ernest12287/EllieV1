import { getChatJid } from '../utils/jidHelper.js';
import { addContact } from '../utils/scheduler.js';
import config from '../config.js';

// ============================================
// 1. ADDUSER COMMAND
// ============================================

export const adduserCommand = {
    name: 'adduser',
    aliases: ['addcontact', 'scheduleadd'],
    description: 'Add user to scheduler',
    usage: '.adduser <number> <name> <relation>',
    category: 'Scheduler',
    
    async execute(sock, message, args) {
        const jid = getChatJid(message);
        
        if (args.length < 3) {
            await sock.sendMessage(jid.chat, {
                text: `╭━━━『 📅 ADD USER 』\n` +
                      `┃\n` +
                      `┃ ❌ Usage:\n` +
                      `┃ ${config.bot.defaultPrefix}adduser <number> <name> <relation>\n` +
                      `┃\n` +
                      `┃ 💡 Example:\n` +
                      `┃ ${config.bot.defaultPrefix}adduser 254793859108 Daisy cousin\n` +
                      `┃ ${config.bot.defaultPrefix}adduser 254123456789 John brother\n` +
                      `┃\n` +
                      `╰━━━━━━━━━━━━━━━⬣`
            });
            return;
        }
        
        let number = args[0].replace(/[^0-9]/g, '');
        
        // Add country code if missing
        if (!number.startsWith('254') && number.length === 9) {
            number = '254' + number;
        }
        
        const name = args[1];
        const relation = args.slice(2).join(' ');
        
        const result = addContact(number, name, relation);
        
        if (result.success) {
            await sock.sendMessage(jid.chat, {
                text: `╭━━━『 ✅ USER ADDED 』\n` +
                      `┃\n` +
                      `┃ 👤 *Name:* ${name}\n` +
                      `┃ 📱 *Number:* +${number}\n` +
                      `┃ 👨‍👩‍👧 *Relation:* ${relation}\n` +
                      `┃\n` +
                      `┃ 📅 *Schedule Active:*\n` +
                      `┃ 🌅 Morning: 7:00 AM\n` +
                      `┃ ☀️ Afternoon: 2:00 PM\n` +
                      `┃ 🌙 Evening: 8:00 PM\n` +
                      `┃\n` +
                      `┃ 📖 Each message includes a random Bible verse!\n` +
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
    adduser: adduserCommand,
};