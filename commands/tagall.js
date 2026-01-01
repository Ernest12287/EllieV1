import config from '../config.js';
import logging from '../logger.js';
import { getChatJid, isUserAdmin } from '../utils/jidHelper.js';

export default {
    name: 'tagall',
    description:'tag group members',
    async execute(sock, message, args) {
        // Line 1: Get EVERYTHING! 🔥
        const jid = getChatJid(message);
        
        // Line 2: Check if group (ONE LINE!)
        if (!jid.isGroup) {
            await sock.sendMessage(jid.chat, { text: config.error.notingroups });
            return;
        }
        
        try {
            const groupMetadata = await sock.groupMetadata(jid.chat);
            const participants = groupMetadata.participants;
            
            // Line 3: Check admin (ONE LINE!)
            const senderIsAdmin = isUserAdmin(groupMetadata, jid.sender);
            
            if (!senderIsAdmin) {
                await sock.sendMessage(jid.chat, { text: config.error.notadmin });
                return;
            }
            
            const tagMessage = args.length > 0 ? args.join(' ') : 'Attention everyone!';
            let mentions = participants.map(p => p.id);
            let text = `╔═══════════════════╗\n`;
            text += `║   📢 *TAG ALL*    ║\n`;
            text += `╚═══════════════════╝\n\n`;
            text += `${tagMessage}\n\n`;
            text += `┌─────────────────\n`;
            
            // Line 4: Format numbers (HELPER METHOD!)
            participants.forEach((p, i) => {
                text += `│ ${i + 1}. @${jid.formatJid(p.id)}\n`;
            });
            
            text += `└─────────────────\n\n`;
            text += `👥 Total: ${participants.length}\n`;
            text += `🤖 ${config.bot.name}`;
            
            await sock.sendMessage(jid.chat, { text, mentions });
            logging.success(`[TAGALL] Tagged ${participants.length} members`);
        } catch (error) {
            logging.error(`[TAGALL] Error: ${error.message}`);
            await sock.sendMessage(jid.chat, { text: '❌ Failed to tag members.' });
        }
    }
};