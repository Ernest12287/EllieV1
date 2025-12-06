import config from '../config.js';
import logging from '../logger.js';
import util from 'util';
import { getChatJid } from '../utils/jidHelper.js';
const getNumberFromJid = (jid) => {
    return jid.split('@')[0].split(':')[0];
};

export default {
    name: 'eval',
    description: 'Execute JavaScript code (DANGEROUS)',
    usage: '.eval <code>',
    category: 'Admin',
    adminOnly: true,
    
    async execute(sock, message, args) {
        const jid = getChatJid(message);
        const ownerNumber = config.creator.number;
        
        const senderCleanNumber = getNumberFromJid(sender);
        if (ownerNumber !== senderCleanNumber) {
            await sock.sendMessage(jid.chat, { text: config.error.notadmin });
            return;
        }
        
        if (args.length === 0) {
            await sock.sendMessage(jid.chat, { 
                text: `❌ Provide code.\n\nUsage: ${config.bot.preffix}eval <code>` 
            });
            return;
        }
        
        const code = args.join(' ');
        
        try {
            logging.warn(`[EVAL] Owner executing: ${code.substring(0, 50)}...`);
            
            let result = eval(code);
            if (result instanceof Promise) result = await result;
            
            const output = util.inspect(result, { depth: 2, colors: false });
            
            await sock.sendMessage(jid.chat, { 
                text: `⚡ *EVAL RESULT*\n\n📝 Code:\n\`\`\`${code}\`\`\`\n\n✅ Output:\n\`\`\`${output}\`\`\`` 
            });
            
        } catch (error) {
            logging.error(`[EVAL] Error: ${error.message}`);
            await sock.sendMessage(jid.chat, { 
                text: `❌ *EVAL ERROR*\n\n\`\`\`${error.message}\`\`\`` 
            });
        }
    }
};