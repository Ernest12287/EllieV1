// ===== horoscope.js =====
import config from '../config.js';
import logging from '../logger.js';
import { getChatJid } from '../utils/jidHelper.js';

export default {
    name: 'horoscope',
    aliases: ['zodiac', 'astrology'],
    description: 'Get daily horoscope',
    usage: '.horoscope <sign>',
    category: 'Fun',
    
    async execute(sock, message, args) {
        const jid = getChatJid(message);
        
        if (args.length < 1) {
            await sock.sendMessage(jid.chat, { 
                text: `╭━━━『 ♈ HOROSCOPE 』
┃
┃ ❌ Usage: ${config.bot.preffix}horoscope <sign>
┃
┃ 🌟 Signs:
┃ aries, taurus, gemini, cancer
┃ leo, virgo, libra, scorpio
┃ sagittarius, capricorn
┃ aquarius, pisces
┃
╰━━━━━━━━━━━━━━━⬣`
            });
            return;
        }
        
        try {
            const sign = args[0].toLowerCase();
            const apiUrl = `https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily?sign=${sign}&day=today`;
            
            const response = await fetch(apiUrl);
            const data = await response.json();
            
            if (data && data.data) {
                const h = data.data;
                const horoscopeText = `╭━━━『 ♈ HOROSCOPE 』
┃
┃ 🌟 *${sign.toUpperCase()}*
┃ 📅 ${h.date}
┃
┃━━━━━━━━━━━━━━
┃
┃ ${h.horoscope_data}
┃
╰━━━━━━━━━━━━━━━⬣

_${config.bot.name}_`;

                await sock.sendMessage(jid.chat, { text: horoscopeText });
                logging.success(`[HOROSCOPE] Sent for: ${sign}`);
            } else {
                await sock.sendMessage(jid.chat, { text: '❌ Invalid sign!' });
            }
        } catch (error) {
            logging.error(`[HOROSCOPE] Error: ${error.message}`);
            await sock.sendMessage(jid.chat, { text: '❌ Error!' });
        }
    }
};