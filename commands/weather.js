import config from '../config.js';
import { getChatJid } from '../utils/jidHelper.js';
export default {
    name: 'weather',
    description: 'Get current weather information',
    usage: '.weather <city> or .weather <city>, <country>',
    category: 'Utility',
    
    async execute(sock, message, args) {
        const jid = getChatJid(message);
        
        if (args.length < 1) {
            await sock.sendMessage(jid.chat, { 
                text: `❌ Usage: ${config.bot.preffix}weather <city>\n\nExamples:\n• ${config.bot.preffix}weather London\n• ${config.bot.preffix}weather "New York"\n• ${config.bot.preffix}weather Tokyo, Japan`
            });
        }

        try {
            await sock.sendMessage(jid.chat, { 
                text: '⏳ Fetching weather data...' 
            });

            const location = args.join(' ');
            const apiKey = config.apikeys.weather || '4eae741def192d7170adcc74d60d9ceb'; // Your key or free one
            
            // Try OpenWeatherMap first
            let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`;
            
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                // Fallback: Use wttr.in (free, no key)
                const fallbackUrl = `https://wttr.in/${encodeURIComponent(location)}?format=%C+%t+%h+%w+%m`;
                const fallbackResponse = await fetch(fallbackUrl);
                
                if (fallbackResponse.ok) {
                    const data = await fallbackResponse.text();
                    await sock.sendMessage(jid.chat, { 
                        text: `🌤️ *Weather in ${location}*\n\n${data}` 
                    });
                    return;
                }
                throw new Error('Location not found');
            }

            const data = await response.json();
            
            const weatherText = `🌤️ *Weather in ${data.name}, ${data.sys.country}*\n\n` +
                               `📊 *Condition:* ${data.weather[0].description}\n` +
                               `🌡️ *Temperature:* ${data.main.temp}°C (Feels like ${data.main.feels_like}°C)\n` +
                               `💧 *Humidity:* ${data.main.humidity}%\n` +
                               `🌬️ *Wind:* ${data.wind.speed} m/s\n` +
                               `☁️ *Clouds:* ${data.clouds.all}%\n` +
                               `👁️ *Visibility:* ${(data.visibility / 1000).toFixed(1)} km\n` +
                               `📏 *Pressure:* ${data.main.pressure} hPa`;

            await sock.sendMessage(jid.chat, { 
                text: weatherText 
            });

        } catch (error) {
            console.error('Weather error:', error);
            await sock.sendMessage(jid.chat, { 
                text: '❌ Weather data not found. Please check the city name.' 
            });
        }
    }
};