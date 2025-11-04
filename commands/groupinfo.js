import config from '../config.js';
import logging from '../logger.js';

export default {
    name: 'groupinfo',
    description: 'Get group information',
    usage: '.groupinfo',
    category: 'Group',
    aliases: ['ginfo'],
    
    async execute(sock, message) {
        const sender = message.key.remoteJid;
        
        if (!sender.endsWith('@g.us')) {
            await sock.sendMessage(sender, { text: config.error.notingroups });
            return;
        }
        
        try {
            const groupMetadata = await sock.groupMetadata(sender);
            const participants = groupMetadata.participants;
            
            const admins = participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin');
            const superAdmins = participants.filter(p => p.admin === 'superadmin');
            const members = participants.filter(p => !p.admin);
            
            const creationDate = new Date(groupMetadata.creation * 1000).toLocaleDateString();
            
            const text = `
╔═══════════════════════════╗
║   📊 *GROUP INFO*          ║
╚═══════════════════════════╝

📝 *Name:* ${groupMetadata.subject}

📄 *Description:*
${groupMetadata.desc || 'No description'}

━━━━━━━━━━━━━━━━━━━━━━━━━━

👥 *Members:*
├ Total: ${participants.length}
├ Admins: ${admins.length}
├ Super Admins: ${superAdmins.length}
└ Members: ${members.length}

━━━━━━━━━━━━━━━━━━━━━━━━━━

🆔 *Group ID:*
${sender}

📅 *Created:* ${creationDate}

━━━━━━━━━━━━━━━━━━━━━━━━━━

🤖 Info by ${config.bot.name}
            `.trim();
            
            await sock.sendMessage(sender, { text });
            
        } catch (error) {
            logging.error(`[GROUPINFO] Error: ${error.message}`);
            await sock.sendMessage(sender, { text: '❌ Failed.' });
        }
    }
};