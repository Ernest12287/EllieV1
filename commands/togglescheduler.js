import { getChatJid } from '../utils/jidHelper.js';
import { toggleScheduler } from '../utils/scheduler.js';
import config from '../config.js';


export const toggleschedulerCommand = {
    name: 'togglescheduler',
    aliases: ['scheduletoggle', 'pauseschedule'],
    description: 'Enable/disable scheduler',
    usage: '.togglescheduler',
    category: 'Scheduler',
    
    async execute(sock, message) {
        const jid = getChatJid(message);
        
        const isEnabled = toggleScheduler();
        
        await sock.sendMessage(jid.chat, {
            text: `╭━━━『 ${isEnabled ? '✅' : '❌'} SCHEDULER 』\n` +
                  `┃\n` +
                  `┃ Status: ${isEnabled ? '*ENABLED*' : '*DISABLED*'}\n` +
                  `┃\n` +
                  `┃ ${isEnabled ? '📅 Automated messages will be sent' : '⏸️ Automated messages paused'}\n` +
                  `┃\n` +
                  `╰━━━━━━━━━━━━━━━⬣`
        });
    }
};

export default {
    togglescheduler: toggleschedulerCommand
};