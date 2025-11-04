import config from '../config.js';

export default {
    name: 'time',
    description: 'Check time in different timezones',
    usage: '.time [city/country] or .time <from> to <to>',
    category: 'Utility',
    
    async execute(sock, message, args) {
        const sender = message.key.remoteJid;

        try {
            let messageText = '';
            
            if (args.length === 0) {
                // Show current time in major cities
                const cities = {
                    'New York': 'America/New_York',
                    'London': 'Europe/London', 
                    'Tokyo': 'Asia/Tokyo',
                    'Dubai': 'Asia/Dubai',
                    'Nairobi': 'Africa/Nairobi',
                    'Sydney': 'Australia/Sydney'
                };

                messageText = '🕐 *Current Time Around the World*\n\n';
                
                for (const [city, timezone] of Object.entries(cities)) {
                    const time = new Date().toLocaleString('en-US', { 
                        timeZone: timezone,
                        timeStyle: 'medium',
                        dateStyle: 'short'
                    });
                    messageText += `🌍 *${city}:* ${time}\n`;
                }
                
            } else if (args.length >= 3 && args[1].toLowerCase() === 'to') {
                // Time conversion
                const fromCity = args[0];
                const toCity = args[2];
                
                // This would require a timezone API
                messageText = `⏰ *Time Conversion*\n\nFeature coming soon!\n\nFor now, use: ${config.bot.preffix}time to see world times.`;
            } else {
                // Specific city time
                const city = args.join(' ');
                messageText = `⏰ *Time in ${city}*\n\nFeature coming soon!\n\nUse ${config.bot.preffix}time to see all major cities.`;
            }

            await sock.sendMessage(sender, { text: messageText });

        } catch (error) {
            console.error('Time error:', error);
            await sock.sendMessage(sender, { 
                text: '❌ Error fetching time information.' 
            });
        }
    }
};