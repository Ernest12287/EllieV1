import { getChatJid } from '../utils/jidHelper.js';
import {  listContacts} from '../utils/scheduler.js';
import config from '../config.js';


export const listusersCommand = {
    name: 'listusers',
    aliases: ['users', 'schedulelist', 'contacts'],
    description: 'List all scheduled users',
    usage: '.listusers',
    category: 'Scheduler',
    
    async execute(sock, message) {
        const jid = getChatJid(message);
        
        const contacts = listContacts();
        
        if (contacts.length === 0) {
            await sock.sendMessage(jid.chat, {
                text: `╭━━━『 📋 USER LIST 』\n` +
                      `┃\n` +
                      `┃ ❌ No users in scheduler\n` +
                      `┃\n` +
                      `┃ 💡 Add users with:\n` +
                      `┃ ${config.bot.defaultPrefix}adduser <number> <name> <relation>\n` +
                      `┃\n` +
                      `╰━━━━━━━━━━━━━━━⬣`
            });
            return;
        }
        
        let text = `╭━━━『 📋 SCHEDULED USERS 』\n┃\n`;
        text += `┃ 👥 *Total:* ${contacts.length}\n┃\n`;
        
        contacts.forEach((contact, index) => {
            text += `┃ ${index + 1}. *${contact.name}*\n`;
            text += `┃    📱 +${contact.number}\n`;
            text += `┃    👨‍👩‍👧 ${contact.relation}\n`;
            text += `┃\n`;
        });
        
        text += `┃ 📅 *Schedule Times:*\n`;
        text += `┃ 🌅 Morning: 7:00 AM\n`;
        text += `┃ ☀️ Afternoon: 2:00 PM\n`;
        text += `┃ 🌙 Evening: 8:00 PM\n`;
        text += `┃\n`;
        text += `╰━━━━━━━━━━━━━━━⬣`;
        
        await sock.sendMessage(jid.chat, { text });
    }
};

export default {
    listusers: listusersCommand
    
};