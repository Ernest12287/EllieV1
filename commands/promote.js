import config from '../config.js';
import logging from '../logger.js';
import { getChatJid } from '../utils/jidHelper.js';
export default {
    name: 'promote',
    description: 'Promote to admin',
    usage: '.promote @user',
    category: 'Group',
    
    async execute(sock, message) {
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
            
            const mentioned = message.message?.extendedTextMessage?.contextInfo?.mentionedJid;
            
            if (!mentioned || mentioned.length === 0) {
                await sock.sendMessage(jid.chat, { 
                    text: `❌ Mention user\n\nUsage: ${config.bot.preffix}promote @user` 
                });
                return;
            }
            
            await sock.groupParticipantsUpdate(sender, mentioned, 'promote');
            
            let text = `✅ *Promoted*\n\n`;
            mentioned.forEach(user => {
                text += `👑 @${user.split('@')[0]}\n`;
            });
            
            await sock.sendMessage(jid.chat, { text, mentions: mentioned });
            
            logging.success(`[PROMOTE] Promoted ${mentioned.length} user(s)`);
            
        } catch (error) {
            logging.error(`[PROMOTE] Error: ${error.message}`);
            await sock.sendMessage(jid.chat, { 
                text: '❌ Failed. Bot must be admin.' 
            });
        }
    }
};