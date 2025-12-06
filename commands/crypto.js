import config from '../config.js';
import logging from '../logger.js';
import { getChatJid } from '../utils/jidHelper.js';
export default {
    name: 'crypto',
    aliases: ['bitcoin', 'btc', 'coin'],
    description: 'Get cryptocurrency prices',
    usage: '.crypto [coin]',
    category: 'Finance',
    
    async execute(sock, message, args) {
        const jid = getChatJid(message);
        const coin = (args[0] || 'bitcoin').toLowerCase();
        
        try {
            await sock.sendMessage(jid.chat, { 
                text: '💰 Fetching crypto prices...' 
            });

            const apiUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd,eur,btc&include_24hr_change=true&include_market_cap=true`;
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data && data[coin]) {
                const price = data[coin];
                const change = price.usd_24h_change?.toFixed(2) || 0;
                const emoji = change >= 0 ? '📈' : '📉';
                
                const cryptoText = `╭━━━『 💰 CRYPTO PRICE 』\n┃\n┃ 🪙 *${coin.toUpperCase()}*\n┃\n┃━━━━━━━━━━━━━━\n┃\n┃ 💵 USD: $${price.usd.toLocaleString()}\n┃ 💶 EUR: €${price.eur.toLocaleString()}\n┃ ₿ BTC: ${price.btc}\n┃\n┃ ${emoji} 24h Change: ${change}%\n┃ 📊 Market Cap: $${(price.usd_market_cap / 1e9).toFixed(2)}B\n┃\n╰━━━━━━━━━━━━━━━⬣\n\n_${config.bot.name} | CoinGecko_`;
                
                await sock.sendMessage(jid.chat, { text: cryptoText });
                logging.success(`[CRYPTO] Sent price for: ${coin}`);
            } else {
                await sock.sendMessage(jid.chat, { 
                    text: `❌ Crypto *"${coin}"* not found!\n\n💡 Try: bitcoin, ethereum, dogecoin, cardano` 
                });
            }

        } catch (error) {
            logging.error(`[CRYPTO] Error: ${error.message}`);
            await sock.sendMessage(jid.chat, { 
                text: '❌ Failed to fetch crypto prices.' 
            });
        }
    }
};