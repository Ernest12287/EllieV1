import { getContentType } from '@whiskeysockets/baileys';
import logging from '../logger.js';

export default async function statusBroadcastHandler(sock, message) {
    
    const messageType = getContentType(message.message);
    const sender = message.key.participant || 'Unknown User';
    
    if (message.key.fromMe) return;

    switch (messageType) {
        case 'imageMessage':
            logging.warn(`[STATUS] Received Image Status from ${sender}.`);
            break;
        case 'videoMessage':
            logging.warn(`[STATUS] Received Video Status from ${sender}.`);
            break;
        case 'extendedTextMessage':
        case 'conversation':
            const text = message.message?.conversation || message.message?.extendedTextMessage?.text;
            logging.warn(`[STATUS] Received Text Status from ${sender}: "${text}"`);
            break;
        default:
            logging.warn(`[STATUS] Received Status of type ${messageType} from ${sender}.`);
            break;
    }
}
