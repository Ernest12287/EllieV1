import { getContentType } from '@whiskeysockets/baileys';
import logging from '../logger.js';

export default async function channelHandler(sock, message) {
    const messageType = getContentType(message.message);
    logging.info(`[CHANNEL] ${messageType}`);
}