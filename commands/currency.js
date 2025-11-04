import config from '../config.js';

export default {
    name: 'currency',
    description: 'Convert between currencies',
    usage: '.currency <amount> <from> to <to>',
    category: 'Finance',
    
    async execute(sock, message, args) {
        const sender = message.key.remoteJid;
        
        if (args.length < 3) {
            return await sock.sendMessage(sender, { 
                text: `❌ Usage: ${config.bot.preffix}currency <amount> <from> to <to>\n\nExamples:\n• ${config.bot.preffix}currency 100 USD to EUR\n• ${config.bot.preffix}currency 1500 JPY to USD\n• ${config.bot.preffix}currency 50 GBP to KES`
            });
        }

        try {
            await sock.sendMessage(sender, { 
                text: '⏳ Converting currency...' 
            });

            const amount = parseFloat(args[0]);
            const fromCurrency = args[1].toUpperCase();
            const toCurrency = args[3].toUpperCase();

            // Using free currency API
            const apiUrl = `https://api.exchangerate.host/latest?base=${fromCurrency}`;
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.success && data.rates[toCurrency]) {
                const rate = data.rates[toCurrency];
                const converted = (amount * rate).toFixed(2);
                
                const messageText = `💱 *Currency Conversion*\n\n` +
                                   `💰 ${amount} ${fromCurrency} = ${converted} ${toCurrency}\n` +
                                   `📊 Exchange Rate: 1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}\n` +
                                   `📅 Last updated: ${new Date(data.date).toLocaleDateString()}`;

                await sock.sendMessage(sender, { text: messageText });
            } else {
                await sock.sendMessage(sender, { 
                    text: '❌ Invalid currency codes or service unavailable.' 
                });
            }

        } catch (error) {
            console.error('Currency error:', error);
            await sock.sendMessage(sender, { 
                text: '❌ Error converting currency. Please check the format.' 
            });
        }
    }
};