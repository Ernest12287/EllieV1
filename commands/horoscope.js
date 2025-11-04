// ===== horoscope.js =====
import config from '../config.js';
import logging from '../logger.js';

export default {
    name: 'horoscope',
    aliases: ['zodiac', 'astrology'],
    description: 'Get daily horoscope',
    usage: '.horoscope <sign>',
    category: 'Fun',
    
    async execute(sock, message, args) {
        const sender = message.key.remoteJid;
        
        if (args.length < 1) {
            return await sock.sendMessage(sender, { 
                text: `╭━━━『 ♈ HOROSCOPE 』\n┃\n┃ ❌ Usage: ${config.bot.preffix}horoscope <sign>\n┃\n┃ 🌟 Signs:\n┃ aries, taurus, gemini, cancer\n┃ leo, virgo, libra, scorpio\n┃ sagittarius, capricorn\n┃ aquarius, pisces\n┃\n╰━━━━━━━━━━━━━━━⬣`
            });
        }

        try {
            const sign = args[0].toLowerCase();
            const apiUrl = `https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily?sign=${sign}&day=today`;
            
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data && data.data) {
                const h = data.data;
                const horoscopeText = `╭━━━『 ♈ HOROSCOPE 』\n┃\n┃ 🌟 *${sign.toUpperCase()}*\n┃ 📅 ${h.date}\n┃\n┃━━━━━━━━━━━━━━\n┃\n┃ ${h.horoscope_data}\n┃\n╰━━━━━━━━━━━━━━━⬣\n\n_${config.bot.name}_`;
                
                await sock.sendMessage(sender, { text: horoscopeText });
                logging.success(`[HOROSCOPE] Sent for: ${sign}`);
            } else {
                await sock.sendMessage(sender, { text: '❌ Invalid sign!' });
            }
        } catch (error) {
            logging.error(`[HOROSCOPE] Error: ${error.message}`);
            await sock.sendMessage(sender, { text: '❌ Error!' });
        }
    }
};




