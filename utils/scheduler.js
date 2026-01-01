// ============================================
// AUTO SCHEDULER - PERSONALIZED MESSAGES
// Send morning/afternoon/evening messages with Bible verses
// ============================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import logging from '../logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTACTS_DB = path.join(__dirname, '../data/scheduler_contacts.json');
const SCHEDULE_CONFIG = path.join(__dirname, '../data/scheduler_config.json');

// ============================================
// DATABASE FUNCTIONS
// ============================================

function loadContacts() {
    try {
        if (fs.existsSync(CONTACTS_DB)) {
            return JSON.parse(fs.readFileSync(CONTACTS_DB, 'utf8'));
        }
    } catch (error) {
        logging.error(`[SCHEDULER] Load contacts error: ${error.message}`);
    }
    return [];
}

function saveContacts(contacts) {
    try {
        const dir = path.dirname(CONTACTS_DB);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(CONTACTS_DB, JSON.stringify(contacts, null, 2));
        logging.success('[SCHEDULER] Contacts saved');
    } catch (error) {
        logging.error(`[SCHEDULER] Save error: ${error.message}`);
    }
}

function loadScheduleConfig() {
    try {
        if (fs.existsSync(SCHEDULE_CONFIG)) {
            return JSON.parse(fs.readFileSync(SCHEDULE_CONFIG, 'utf8'));
        }
    } catch (error) {
        logging.error(`[SCHEDULER] Load config error: ${error.message}`);
    }
    // Default times (24-hour format)
    return {
        enabled: true,
        morning: { hour: 7, minute: 0 },    // 7:00 AM
        afternoon: { hour: 14, minute: 0 }, // 2:00 PM
        evening: { hour: 20, minute: 0 },   // 8:00 PM
        lastSent: {}
    };
}

function saveScheduleConfig(config) {
    try {
        const dir = path.dirname(SCHEDULE_CONFIG);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(SCHEDULE_CONFIG, JSON.stringify(config, null, 2));
    } catch (error) {
        logging.error(`[SCHEDULER] Save config error: ${error.message}`);
    }
}

// ============================================
// BIBLE VERSE API
// ============================================

async function getRandomBibleVerse() {
    try {
        const response = await fetch('https://bible-api.com/?random=verse');
        const data = await response.json();
        
        return {
            verse: data.text.trim(),
            reference: data.reference
        };
    } catch (error) {
        logging.error(`[BIBLE API] Error: ${error.message}`);
        // Fallback verses
        const fallback = [
            { verse: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.", reference: "Jeremiah 29:11" },
            { verse: "Trust in the Lord with all your heart and lean not on your own understanding.", reference: "Proverbs 3:5" },
            { verse: "I can do all things through Christ who strengthens me.", reference: "Philippians 4:13" }
        ];
        return fallback[Math.floor(Math.random() * fallback.length)];
    }
}

// ============================================
// MESSAGE TEMPLATES
// ============================================

async function generateMorningMessage(name, relation) {
    const verse = await getRandomBibleVerse();
    
    return `🌅 *Good Morning, ${name}!* ☀️\n\n` +
           `I hope this beautiful morning finds you well, dear ${relation}.\n\n` +
           `📖 *Today's Verse:*\n` +
           `_"${verse.verse}"_\n\n` +
           `*- ${verse.reference}*\n\n` +
           `May your day be filled with blessings and grace! 🙏✨`;
}

async function generateAfternoonMessage(name, relation) {
    const verse = await getRandomBibleVerse();
    
    return `☀️ *Good Afternoon, ${name}!* 🌤️\n\n` +
           `Hope your day is going wonderfully, dear ${relation}.\n\n` +
           `📖 *Midday Encouragement:*\n` +
           `_"${verse.verse}"_\n\n` +
           `*- ${verse.reference}*\n\n` +
           `Keep pushing forward! God is with you! 💪🙏`;
}

async function generateEveningMessage(name, relation) {
    const verse = await getRandomBibleVerse();
    
    return `🌙 *Good Evening, ${name}!* ⭐\n\n` +
           `I hope your day was gracious and blessed, dear ${relation}.\n\n` +
           `📖 *Evening Reflection:*\n` +
           `_"${verse.verse}"_\n\n` +
           `*- ${verse.reference}*\n\n` +
           `Rest well tonight. God's peace be with you! 🌟🙏`;
}

// ============================================
// SCHEDULER LOGIC
// ============================================

export async function checkAndSendScheduledMessages(sock) {
    const config = loadScheduleConfig();
    
    if (!config.enabled) {
        return;
    }
    
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const today = now.toDateString();
    
    const contacts = loadContacts();
    
    if (contacts.length === 0) {
        return;
    }
    
    // Check morning time
    if (currentHour === config.morning.hour && currentMinute === config.morning.minute) {
        if (config.lastSent.morning !== today) {
            logging.info('[SCHEDULER] Sending morning messages...');
            for (const contact of contacts) {
                try {
                    const message = await generateMorningMessage(contact.name, contact.relation);
                    const jid = contact.number.includes('@') ? contact.number : `${contact.number}@s.whatsapp.net`;
                    
                    await sock.sendMessage(jid, { text: message });
                    logging.success(`[SCHEDULER] Morning message sent to ${contact.name}`);
                    
                    // Delay between messages
                    await new Promise(resolve => setTimeout(resolve, 2000));
                } catch (error) {
                    logging.error(`[SCHEDULER] Failed to send to ${contact.name}: ${error.message}`);
                }
            }
            config.lastSent.morning = today;
            saveScheduleConfig(config);
        }
    }
    
    // Check afternoon time
    if (currentHour === config.afternoon.hour && currentMinute === config.afternoon.minute) {
        if (config.lastSent.afternoon !== today) {
            logging.info('[SCHEDULER] Sending afternoon messages...');
            for (const contact of contacts) {
                try {
                    const message = await generateAfternoonMessage(contact.name, contact.relation);
                    const jid = contact.number.includes('@') ? contact.number : `${contact.number}@s.whatsapp.net`;
                    
                    await sock.sendMessage(jid, { text: message });
                    logging.success(`[SCHEDULER] Afternoon message sent to ${contact.name}`);
                    
                    await new Promise(resolve => setTimeout(resolve, 2000));
                } catch (error) {
                    logging.error(`[SCHEDULER] Failed to send to ${contact.name}: ${error.message}`);
                }
            }
            config.lastSent.afternoon = today;
            saveScheduleConfig(config);
        }
    }
    
    // Check evening time
    if (currentHour === config.evening.hour && currentMinute === config.evening.minute) {
        if (config.lastSent.evening !== today) {
            logging.info('[SCHEDULER] Sending evening messages...');
            for (const contact of contacts) {
                try {
                    const message = await generateEveningMessage(contact.name, contact.relation);
                    const jid = contact.number.includes('@') ? contact.number : `${contact.number}@s.whatsapp.net`;
                    
                    await sock.sendMessage(jid, { text: message });
                    logging.success(`[SCHEDULER] Evening message sent to ${contact.name}`);
                    
                    await new Promise(resolve => setTimeout(resolve, 2000));
                } catch (error) {
                    logging.error(`[SCHEDULER] Failed to send to ${contact.name}: ${error.message}`);
                }
            }
            config.lastSent.evening = today;
            saveScheduleConfig(config);
        }
    }
}

// ============================================
// START SCHEDULER (Call from index.js)
// ============================================

export function startScheduler(sock) {
    logging.info('[SCHEDULER] Starting automated scheduler...');
    
    // Check every minute
    setInterval(() => {
        checkAndSendScheduledMessages(sock);
    }, 60000); // 60 seconds
    
    logging.success('[SCHEDULER] Scheduler is running!');
}

// ============================================
// COMMAND EXPORTS
// ============================================

export function addContact(number, name, relation) {
    const contacts = loadContacts();
    
    // Check if contact exists
    const exists = contacts.find(c => c.number === number);
    if (exists) {
        return { success: false, message: 'Contact already exists!' };
    }
    
    contacts.push({
        number,
        name,
        relation,
        addedAt: new Date().toISOString()
    });
    
    saveContacts(contacts);
    return { success: true, message: `Added ${name} (${relation})` };
}

export function removeContact(number) {
    const contacts = loadContacts();
    const filtered = contacts.filter(c => c.number !== number);
    
    if (filtered.length === contacts.length) {
        return { success: false, message: 'Contact not found!' };
    }
    
    saveContacts(filtered);
    return { success: true, message: 'Contact removed successfully!' };
}

export function listContacts() {
    return loadContacts();
}

export function toggleScheduler() {
    const config = loadScheduleConfig();
    config.enabled = !config.enabled;
    saveScheduleConfig(config);
    return config.enabled;
}

export function setScheduleTimes(morning, afternoon, evening) {
    const config = loadScheduleConfig();
    
    if (morning) {
        const [hour, minute] = morning.split(':').map(Number);
        config.morning = { hour, minute };
    }
    
    if (afternoon) {
        const [hour, minute] = afternoon.split(':').map(Number);
        config.afternoon = { hour, minute };
    }
    
    if (evening) {
        const [hour, minute] = evening.split(':').map(Number);
        config.evening = { hour, minute };
    }
    
    saveScheduleConfig(config);
    return { success: true, config };
}