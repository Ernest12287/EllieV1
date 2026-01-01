import {  setScheduleTimes } from '../utils/scheduler.js';
import config from '../config.js';


export const setscheduleCommand = {
    name: 'setschedule',
    aliases: ['scheduletime', 'settime'],
    description: 'Set scheduler times',
    usage: '.setschedule <morning> <afternoon> <evening>',
    category: 'Scheduler',
    
    async execute(sock, message, args) {
        const jid = getChatJid(message);
        
        if (args.length < 3) {
            await sock.sendMessage(jid.chat, {
                text: `╭━━━『 ⏰ SET SCHEDULE 』\n` +
                      `┃\n` +
                      `┃ ❌ Usage:\n` +
                      `┃ ${config.bot.defaultPrefix}setschedule <HH:MM> <HH:MM> <HH:MM>\n` +
                      `┃\n` +
                      `┃ 💡 Example:\n` +
                      `┃ ${config.bot.defaultPrefix}setschedule 07:00 14:00 20:00\n` +
                      `┃ (Morning Afternoon Evening)\n` +
                      `┃\n` +
                      `┃ ⏰ Use 24-hour format\n` +
                      `┃\n` +
                      `╰━━━━━━━━━━━━━━━⬣`
            });
            return;
        }
        
        const [morning, afternoon, evening] = args;
        
        const result = setScheduleTimes(morning, afternoon, evening);
        
        if (result.success) {
            await sock.sendMessage(jid.chat, {
                text: `╭━━━『 ✅ SCHEDULE UPDATED 』\n` +
                      `┃\n` +
                      `┃ 🌅 *Morning:* ${morning}\n` +
                      `┃ ☀️ *Afternoon:* ${afternoon}\n` +
                      `┃ 🌙 *Evening:* ${evening}\n` +
                      `┃\n` +
                      `┃ ⏰ New times will take effect immediately\n` +
                      `┃\n` +
                      `╰━━━━━━━━━━━━━━━⬣`
            });
        }
    }
};

export default {
    setschedule: setscheduleCommand
};