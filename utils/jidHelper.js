// ============================================
// ALL-IN-ONE JID HELPER FOR BAILEYS V7
// ONE FUNCTION RETURNS EVERYTHING! 🚀
// ============================================

/**
 * THE ONLY FUNCTION YOU NEED!
 * Returns ALL JID info in ONE call
 * 
 * @param {Object} message - The Baileys message object
 * @returns {Object} Everything you'll ever need for any command
 * 
 * @example
 * // OLD WAY (multiple lines):
 * const sender = message.key.remoteJid;
 * const user = message.key.participant || sender;
 * const isGroup = sender.endsWith('@g.us');
 * const userNumber = user.split('@')[0];
 * 
 * // NEW WAY (ONE line, get EVERYTHING):
 * const jid = getChatJid(message);
 * 
 * // Then use:
 * jid.chat          // Where to reply (replaces old 'sender')
 * jid.sender        // Who sent it (replaces old 'participant')
 * jid.senderNumber  // Their number for mentions
 * jid.isGroup       // Is it a group?
 * // ... and 15+ more properties!
 */
export function getChatJid(message) {
    const key = message.key;
    
    // ============================================
    // CORE JIDS (Use these 99% of the time)
    // ============================================
    
    // Chat JID - WHERE the message came from (group or DM)
    const chat = key.remoteJid;
    
    // Sender JID - WHO actually sent it (V7 LID-aware)
    // Priority: PN (phone number) over LID
    const sender = key.participantAlt ||  // V7: PN in groups
                   key.remoteJidAlt ||    // V7: PN in DMs
                   key.participant ||      // Fallback: LID in groups
                   chat;                   // Fallback: chat JID for DMs
    
    // Sender's phone number (for mentions and display)
    const senderNumber = sender.split('@')[0].split(':')[0];
    
    // ============================================
    // BOOLEAN CHECKS (Quick conditionals)
    // ============================================
    
    const isGroup = chat.endsWith('@g.us');
    const isFromMe = key.fromMe === true;
    const isBroadcast = chat === 'status@broadcast';
    const isChannel = chat?.endsWith('@newsletter') || false;
    const isDM = !isGroup && !isBroadcast && !isChannel;
    
    // ============================================
    // CONTEXT INFO (For replies, mentions, etc)
    // ============================================
    
    const contextInfo = message.message?.extendedTextMessage?.contextInfo || {};
    
    // Mentioned users in the message
    const mentionedJids = contextInfo.mentionedJid || [];
    
    // Quoted/replied message info
    const quotedMessage = contextInfo.quotedMessage || null;
    const quotedParticipant = contextInfo.participantAlt || contextInfo.participant || null;
    const hasQuoted = !!quotedMessage;
    
    // ============================================
    // HELPER METHODS (Attached to the object)
    // ============================================
    
    return {
        // ==========================================
        // PRIMARY PROPERTIES - Use these in commands
        // ==========================================
        
        /**
         * Where to send replies (group JID or user JID)
         * REPLACES: Your old "sender" variable
         */
        chat,
        
        /**
         * Who sent the message (always PN if available)
         * REPLACES: message.key.participant || message.key.remoteJid
         */
        sender,
        
        /**
         * Sender's phone number without @s.whatsapp.net
         * USE FOR: @mentions and display
         * EXAMPLE: "254123456789"
         */
        senderNumber,
        
        // ==========================================
        // BOOLEAN CHECKS - Quick conditionals
        // ==========================================
        
        /** Is this a group message? */
        isGroup,
        
        /** Did the bot send this? */
        isFromMe,
        
        /** Is this a status/broadcast? */
        isBroadcast,
        
        /** Is this from a channel? */
        isChannel,
        
        /** Is this a DM (not group/broadcast/channel)? */
        isDM,
        
        // ==========================================
        // CONTEXT INFO - For advanced commands
        // ==========================================
        
        /** Array of mentioned user JIDs */
        mentionedJids,
        
        /** Does message have a quoted/reply? */
        hasQuoted,
        
        /** The quoted message object */
        quotedMessage,
        
        /** Who was quoted/replied to (JID) */
        quotedParticipant,
        
        // ==========================================
        // RAW ACCESS - If you need originals
        // ==========================================
        
        raw: {
            remoteJid: key.remoteJid,
            participant: key.participant,
            participantAlt: key.participantAlt,
            remoteJidAlt: key.remoteJidAlt,
            fromMe: key.fromMe,
            id: key.id
        },
        
        // ==========================================
        // UTILITY METHODS - Handy helpers
        // ==========================================
        
        /**
         * Format a JID for display (remove domain)
         * @param {string} jid - The JID to format
         * @returns {string} Just the number
         */
        formatJid: (jid) => jid.split('@')[0].split(':')[0],
        
        /**
         * Check if a specific JID is the sender
         * @param {string} jid - JID to check
         * @returns {boolean}
         */
        isSender: (jid) => {
            const checkJid = jid.split('@')[0].split(':')[0];
            return checkJid === senderNumber;
        },
        
        /**
         * Check if sender was mentioned in the message
         * @returns {boolean}
         */
        senderWasMentioned: () => {
            return mentionedJids.some(jid => 
                jid.split('@')[0].split(':')[0] === senderNumber
            );
        }
    };
}

// ============================================
// ADDITIONAL STANDALONE HELPERS
// ============================================

/**
 * Get bot's own JID from socket
 * @param {Object} sock - The socket connection
 * @returns {string} Bot's JID in PN format
 */
export function getBotJid(sock) {
    const botJid = sock.user.id;
    if (botJid.includes(':')) {
        return botJid.split(':')[0] + '@s.whatsapp.net';
    }
    return botJid;
}

/**
 * Get bot's phone number
 * @param {Object} sock - The socket connection
 * @returns {string} Just the number
 */
export function getBotNumber(sock) {
    return sock.user.id.split(':')[0].split('@')[0];
}

/**
 * Check if a JID is a phone number (PN) format
 * V7: Replaces the old isJidUser()
 */
export function isPnUser(jid) {
    return jid?.endsWith('@s.whatsapp.net');
}

/**
 * Check if a JID is a LID format
 */
export function isLidUser(jid) {
    return jid?.endsWith('@lid');
}

/**
 * Format any JID for display
 * @param {string} jid - The JID to format
 * @returns {string} Just the number/id
 */
export function formatJid(jid) {
    return jid.split('@')[0].split(':')[0];
}

/**
 * Check if user is admin in a group
 * @param {Object} groupMetadata - From sock.groupMetadata(chatJid)
 * @param {string} userJid - User's JID to check
 * @returns {boolean}
 */
export function isUserAdmin(groupMetadata, userJid) {
    const userNumber = userJid.split('@')[0].split(':')[0];
    const participant = groupMetadata.participants.find(p => {
        const pNumber = p.id.split('@')[0].split(':')[0];
        return pNumber === userNumber;
    });
    return participant && (participant.admin === 'admin' || participant.admin === 'superadmin');
}

/**
 * Check if bot is admin in a group
 * @param {Object} sock - Socket connection
 * @param {Object} groupMetadata - From sock.groupMetadata(chatJid)
 * @returns {boolean}
 */
export function isBotAdmin(sock, groupMetadata) {
    const botJid = getBotJid(sock);
    return isUserAdmin(groupMetadata, botJid);
}

// ============================================
// LEGACY ALIASES (for backward compatibility)
// ============================================

/**
 * @deprecated Use getChatJid(message).sender instead
 */
export function getSenderJid(message) {
    return getChatJid(message).sender;
}

/**
 * @deprecated Use getChatJid(message).senderNumber instead
 */
export function getSenderNumber(message) {
    return getChatJid(message).senderNumber;
}

/**
 * @deprecated Use getChatJid(message).isGroup instead
 */
export function isGroup(message) {
    return getChatJid(message).isGroup;
}

// ============================================
// EXPORT DEFAULT
// ============================================
export default getChatJid;