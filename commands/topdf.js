import config from '../config.js';
import logging from '../logger.js';
import { getChatJid } from '../utils/jidHelper.js';
export default {
    name: 'topdf',
    aliases: ['makepdf', 'pdf'],
    description: 'Convert text or URL to PDF',
    usage: '.topdf <text/url>',
    category: 'Utility',
    
    async execute(sock, message, args) {
        const jid = getChatJid(message);
        
        if (args.length < 1) {
            await sock.sendMessage(jid.chat, { 
                text: `╭━━━『 📄 TO PDF 』\n┃\n┃ ❌ Usage: ${config.bot.preffix}topdf <text>\n┃\n┃ 💡 Examples:\n┃ ${config.bot.preffix}topdf Hello World\n┃ ${config.bot.preffix}topdf https://example.com\n┃\n╰━━━━━━━━━━━━━━━⬣`
            });
        }

        try {
            await sock.sendMessage(jid.chat, { 
                text: '📄 Creating PDF...' 
            });

            const query = args.join(' ');
            const apiUrl = `https://api.giftedtech.co.ke/api/tools/topdf?apikey=gifted&query=${encodeURIComponent(query)}`;
            
            await sock.sendMessage(jid.chat, {
                document: { url: apiUrl },
                mimetype: 'application/pdf',
                fileName: `document_${Date.now()}.pdf`,
                caption: `╭━━━『 📄 PDF CREATED 』\n┃\n╰━━━━━━━━━━━━━━━⬣\n\n_${config.bot.name}_`
            });
            
            logging.success(`[TOPDF] PDF created`);

        } catch (error) {
            logging.error(`[TOPDF] Error: ${error.message}`);
            await sock.sendMessage(jid.chat, { 
                text: `❌ Error creating PDF!` 
            });
        }
    }
};