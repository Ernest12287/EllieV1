import config from '../config.js';
import logging from '../logger.js';
import { getChatJid } from '../utils/jidHelper.js';
export default {
    name: 'announce',
    description: 'Send announcement',
    usage: '.announce <message>',
    category: 'Group',
    
    async execute(sock, message, args) {
        const jid = getChatJid(message);
        
        if (!sender.endsWith('@g.us')) {
            await sock.sendMessage(jid.chat, { text: config.error.notingroups });
            return;
        }
        
        try {
            const groupMetadata = await sock.groupMetadata(sender);
            const participants = groupMetadata.participants;
            
            const senderIsAdmin = participants.find(p => 
                p.id === message.key.participant && (p.admin === 'admin' || p.admin === 'superadmin')
            );
            
            if (!senderIsAdmin) {
                await sock.sendMessage(jid.chat, { text: config.error.notadmin });
                return;
            }
            
            if (args.length === 0) {
                await sock.sendMessage(jid.chat, { 
                    text: `❌ Provide message\n\nUsage: ${config.bot.preffix}announce <message>` 
                });
                return;
            }
            
            const announcement = args.join(' ');
            const senderName = message.pushName || 'Admin';
            
            const text = `
╔═══════════════════════════╗
║   📢 *ANNOUNCEMENT*        ║
╚═══════════════════════════╝

${announcement}

━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 By: ${senderName}
🏷️ Group: ${groupMetadata.subject}
📅 ${new Date().toLocaleString()}
🤖 ${config.bot.name}
            `.trim();
            
            await sock.sendMessage(jid.chat, { text });
            
            logging.success(`[ANNOUNCE] Sent in ${groupMetadata.subject}`);
            
        } catch (error) {
            logging.error(`[ANNOUNCE] Error: ${error.message}`);
            await sock.sendMessage(jid.chat, { text: '❌ Failed.' });
        }
    }
};