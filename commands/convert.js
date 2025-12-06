import config from '../config.js';
import { getChatJid } from '../utils/jidHelper.js';
export default {
    name: 'convert',
    description: 'Convert between different units',
    usage: '.convert <amount> <from> to <to>',
    category: 'Utility',
    
    async execute(sock, message, args) {
        const jid = getChatJid(message);
        
        if (args.length < 3) {
            await sock.sendMessage(jid.chat, { 
                text: `❌ Usage: ${config.bot.preffix}convert <amount> <from> to <to>\n\nSupported: length, weight, temperature\n\nExamples:\n• ${config.bot.preffix}convert 10 km to miles\n• ${config.bot.preffix}convert 32 fahrenheit to celsius\n• ${config.bot.preffix}convert 5 kg to pounds`
            });
        }

        try {
            const amount = parseFloat(args[0]);
            const fromUnit = args[1].toLowerCase();
            const toUnit = args[3].toLowerCase();

            const result = this._convertUnit(amount, fromUnit, toUnit);
            
            if (result) {
                await sock.sendMessage(jid.chat, { 
                    text: `📐 *Unit Conversion*\n\n${amount} ${fromUnit} = ${result.value.toFixed(4)} ${toUnit}\n\nFormula: ${result.formula}` 
                });
            } else {
                await sock.sendMessage(jid.chat, { 
                    text: '❌ Unsupported conversion. Use: length, weight, or temperature units.' 
                });
            }

        } catch (error) {
            console.error('Convert error:', error);
            await sock.sendMessage(jid.chat, { 
                text: '❌ Error converting units. Please check the format.' 
            });
        }
    },

    _convertUnit(amount, from, to) {
        const conversions = {
            // Length
            'km-mile': { value: amount * 0.621371, formula: 'km × 0.621371' },
            'mile-km': { value: amount * 1.60934, formula: 'miles × 1.60934' },
            'm-foot': { value: amount * 3.28084, formula: 'meters × 3.28084' },
            'foot-m': { value: amount * 0.3048, formula: 'feet × 0.3048' },
            
            // Weight
            'kg-pound': { value: amount * 2.20462, formula: 'kg × 2.20462' },
            'pound-kg': { value: amount * 0.453592, formula: 'pounds × 0.453592' },
            
            // Temperature
            'celsius-fahrenheit': { value: (amount * 9/5) + 32, formula: '(°C × 9/5) + 32' },
            'fahrenheit-celsius': { value: (amount - 32) * 5/9, formula: '(°F - 32) × 5/9' },
            'celsius-kelvin': { value: amount + 273.15, formula: '°C + 273.15' }
        };

        const key = `${from}-${to}`;
        return conversions[key];
    }
};