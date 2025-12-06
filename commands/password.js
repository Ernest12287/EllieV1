import config from '../config.js';
import { getChatJid } from '../utils/jidHelper.js';
export default {
    name: 'password',
    description: 'Generate secure passwords',
    usage: '.password [length] or .password <length> <complexity>',
    category: 'Security',
    
    async execute(sock, message, args) {
        const jid = getChatJid(message);

        try {
            const length = parseInt(args[0]) || 12;
            const complexity = args[1]?.toLowerCase() || 'strong';
            
            if (length < 6 || length > 50) {
                await sock.sendMessage(jid.chat, { 
                    text: '❌ Password length must be between 6 and 50 characters.' 
                });
            }

            const password = this._generatePassword(length, complexity);
            const strength = this._checkPasswordStrength(password);

            const messageText = `🔐 *Secure Password Generated*\n\n` +
                               `📝 *Password:* \`${password}\`\n` +
                               `📏 *Length:* ${length} characters\n` +
                               `🛡️ *Strength:* ${strength.level} (${strength.score}/100)\n\n` +
                               `*Security Tips:*\n` +
                               `• Don't share this password\n` +
                               `• Use a password manager\n` +
                               `• Enable 2FA when possible\n` +
                               `• Change passwords regularly`;

            await sock.sendMessage(jid.chat, { text: messageText });

        } catch (error) {
            console.error('Password error:', error);
            await sock.sendMessage(jid.chat, { 
                text: '❌ Error generating password.' 
            });
        }
    },

    _generatePassword(length, complexity) {
        const chars = {
            lower: 'abcdefghijklmnopqrstuvwxyz',
            upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            numbers: '0123456789',
            symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
        };

        let characterSet = '';
        
        switch(complexity) {
            case 'weak':
                characterSet = chars.lower + chars.upper;
                break;
            case 'medium':
                characterSet = chars.lower + chars.upper + chars.numbers;
                break;
            case 'strong':
            default:
                characterSet = chars.lower + chars.upper + chars.numbers + chars.symbols;
        }

        let password = '';
        for (let i = 0; i < length; i++) {
            password += characterSet.charAt(Math.floor(Math.random() * characterSet.length));
        }

        return password;
    },

    _checkPasswordStrength(password) {
        let score = 0;
        
        // Length check
        if (password.length >= 8) score += 25;
        if (password.length >= 12) score += 15;
        
        // Character variety
        if (/[a-z]/.test(password)) score += 10;
        if (/[A-Z]/.test(password)) score += 10;
        if (/[0-9]/.test(password)) score += 10;
        if (/[^A-Za-z0-9]/.test(password)) score += 10;
        
        // Bonus for mixed case and numbers
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 10;
        if (/[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) score += 10;

        let level = 'Weak';
        if (score >= 70) level = 'Strong';
        else if (score >= 50) level = 'Good';
        else if (score >= 30) level = 'Fair';

        return { level, score: Math.min(score, 100) };
    }
};