// ============================================
// ANTICALL HANDLER
// Auto-reject incoming calls
// ============================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import logging from '../logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ANTICALL_DB = path.join(__dirname, '../data/anticall.json');

// ============================================
// ANTICALL DATABASE
// ============================================

function loadAnticallSettings() {
    try {
        if (fs.existsSync(ANTICALL_DB)) {
            return JSON.parse(fs.readFileSync(ANTICALL_DB, 'utf8'));
        }
    } catch (error) {
        logging.error(`[ANTICALL] Load error: ${error.message}`);
    }
    return { enabled: true, sendMessage: true };
}

function saveAnticallSettings(settings) {
    try {
        const dir = path.dirname(ANTICALL_DB);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(ANTICALL_DB, JSON.stringify(settings, null, 2));
    } catch (error) {
        logging.error(`[ANTICALL] Save error: ${error.message}`);
    }
}

// ============================================
// CALL HANDLER
// ============================================

export async function handleCall(sock, call) {
    try {
        const settings = loadAnticallSettings();
        
        if (!settings.enabled) {
            logging.info('[ANTICALL] Disabled, allowing call');
            return;
        }
        
        const callId = call.id;
        const caller = call.from;
        const callerNumber = caller.split('@')[0];
        const isVideo = call.isVideo;
        
        logging.warn(`[ANTICALL] Incoming ${isVideo ? 'video' : 'voice'} call from ${callerNumber}`);
        
        // Reject the call
        await sock.rejectCall(callId, caller);
        logging.success(`[ANTICALL] Call rejected from ${callerNumber}`);
        
        // Send auto-reply message
        if (settings.sendMessage) {
            const message = `📞 *Call Auto-Rejected*\n\n` +
                          `Sorry, I'm currently busy and can't take calls right now.\n\n` +
                          `Please send me a text message instead, and I'll get back to you as soon as possible! 📱\n\n` +
                          `_This is an automated response. Calls are automatically rejected._`;
            
            try {
                await sock.sendMessage(caller, { text: message });
                logging.success(`[ANTICALL] Auto-reply sent to ${callerNumber}`);
            } catch (msgError) {
                logging.warn(`[ANTICALL] Failed to send message: ${msgError.message}`);
            }
        }
        
    } catch (error) {
        logging.error(`[ANTICALL] Error: ${error.message}`);
    }
}

// ============================================
// ANTICALL COMMAND EXPORTS
// ============================================

export function toggleAnticall() {
    const settings = loadAnticallSettings();
    settings.enabled = !settings.enabled;
    saveAnticallSettings(settings);
    return settings.enabled;
}

export function toggleAnticallMessage() {
    const settings = loadAnticallSettings();
    settings.sendMessage = !settings.sendMessage;
    saveAnticallSettings(settings);
    return settings.sendMessage;
}

export function getAnticallStatus() {
    return loadAnticallSettings();
}

// ============================================
// ANTISPAM HANDLER (.zip, .rar files)
// ============================================

const ANTISPAM_DB = path.join(__dirname, '../data/antispam.json');
const BLOCKED_USERS_DB = path.join(__dirname, '../data/blocked_spammers.json');

function loadAntispamSettings() {
    try {
        if (fs.existsSync(ANTISPAM_DB)) {
            return JSON.parse(fs.readFileSync(ANTISPAM_DB, 'utf8'));
        }
    } catch (error) {
        logging.error(`[ANTISPAM] Load error: ${error.message}`);
    }
    return {
        enabled: true,
        blockedExtensions: ['.zip', '.rar', '.7z', '.tar', '.gz', '.apk'],
        blockSender: true,
        deleteMessage: true
    };
}

function saveAntispamSettings(settings) {
    try {
        const dir = path.dirname(ANTISPAM_DB);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(ANTISPAM_DB, JSON.stringify(settings, null, 2));
    } catch (error) {
        logging.error(`[ANTISPAM] Save error: ${error.message}`);
    }
}

function loadBlockedUsers() {
    try {
        if (fs.existsSync(BLOCKED_USERS_DB)) {
            return JSON.parse(fs.readFileSync(BLOCKED_USERS_DB, 'utf8'));
        }
    } catch (error) {
        logging.error(`[ANTISPAM] Load blocked users error: ${error.message}`);
    }
    return [];
}

function saveBlockedUsers(users) {
    try {
        const dir = path.dirname(BLOCKED_USERS_DB);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(BLOCKED_USERS_DB, JSON.stringify(users, null, 2));
    } catch (error) {
        logging.error(`[ANTISPAM] Save blocked users error: ${error.message}`);
    }
}

function addBlockedUser(jid, reason) {
    const blocked = loadBlockedUsers();
    
    if (!blocked.find(b => b.jid === jid)) {
        blocked.push({
            jid,
            reason,
            blockedAt: new Date().toISOString()
        });
        saveBlockedUsers(blocked);
        return true;
    }
    return false;
}

// ============================================
// DOCUMENT/FILE CHECKER
// ============================================

export async function checkForSpamFiles(sock, message, chatJid) {
    try {
        const settings = loadAntispamSettings();
        
        if (!settings.enabled) {
            return false;
        }
        
        const documentMessage = message.message?.documentMessage;
        
        if (!documentMessage) {
            return false;
        }
        
        const fileName = documentMessage.fileName || '';
        const fileExtension = path.extname(fileName).toLowerCase();
        
        // Check if extension is blocked
        if (settings.blockedExtensions.includes(fileExtension)) {
            logging.warn(`[ANTISPAM] Blocked file detected: ${fileName} (${fileExtension})`);
            
            const senderJid = message.key.participantAlt || 
                            message.key.participant || 
                            message.key.remoteJid;
            const senderNumber = senderJid.split('@')[0];
            
            // Delete message if enabled
            if (settings.deleteMessage) {
                try {
                    await sock.sendMessage(chatJid, { delete: message.key });
                    logging.success(`[ANTISPAM] Deleted spam file from ${senderNumber}`);
                } catch (delError) {
                    logging.error(`[ANTISPAM] Failed to delete: ${delError.message}`);
                }
            }
            
            // Block sender if enabled
            if (settings.blockSender) {
                const blocked = addBlockedUser(senderJid, `Spam file: ${fileName}`);
                
                if (blocked) {
                    try {
                        await sock.updateBlockStatus(senderJid, 'block');
                        logging.success(`[ANTISPAM] Blocked spammer: ${senderNumber}`);
                        
                        // Send warning in group
                        if (chatJid.endsWith('@g.us')) {
                            const warningText = `🚫 *SPAM DETECTED & BLOCKED*\n\n` +
                                              `📂 File: ${fileName}\n` +
                                              `👤 Sender: @${senderNumber}\n` +
                                              `⚠️ User has been blocked\n\n` +
                                              `_Spam files (.zip, .rar, etc.) are not allowed._`;
                            
                            await sock.sendMessage(chatJid, {
                                text: warningText,
                                mentions: [senderJid]
                            });
                        }
                    } catch (blockError) {
                        logging.error(`[ANTISPAM] Failed to block: ${blockError.message}`);
                    }
                } else {
                    logging.info(`[ANTISPAM] User already blocked`);
                }
            } else {
                // Just send warning without blocking
                if (chatJid.endsWith('@g.us')) {
                    const warningText = `⚠️ *SPAM FILE DETECTED*\n\n` +
                                      `📂 File: ${fileName}\n` +
                                      `👤 Sender: @${senderNumber}\n` +
                                      `🗑️ Message deleted\n\n` +
                                      `_Please don't send spam files._`;
                    
                    await sock.sendMessage(chatJid, {
                        text: warningText,
                        mentions: [senderJid]
                    });
                }
            }
            
            return true; // File was spam
        }
        
        return false; // File is safe
        
    } catch (error) {
        logging.error(`[ANTISPAM] Error: ${error.message}`);
        return false;
    }
}

// ============================================
// ANTISPAM COMMAND EXPORTS
// ============================================

export function toggleAntispam() {
    const settings = loadAntispamSettings();
    settings.enabled = !settings.enabled;
    saveAntispamSettings(settings);
    return settings.enabled;
}

export function toggleAntispamBlock() {
    const settings = loadAntispamSettings();
    settings.blockSender = !settings.blockSender;
    saveAntispamSettings(settings);
    return settings.blockSender;
}

export function getAntispamStatus() {
    return loadAntispamSettings();
}

export function getBlockedSpammers() {
    return loadBlockedUsers();
}

export function unblockSpammer(jid) {
    const blocked = loadBlockedUsers();
    const filtered = blocked.filter(b => b.jid !== jid);
    saveBlockedUsers(filtered);
    return filtered.length < blocked.length;
}