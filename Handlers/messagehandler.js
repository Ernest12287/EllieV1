import { getContentType } from '@whiskeysockets/baileys'; 
import normalMessageHandler from './normalMessageHandler.js'; 
import statusBroadcastHandler from './statusbroadcasthandler.js';
import channelHandler from './channelhandler.js';

export default async function handleMessages(sock, m, commands) {
    if (!m.message) return;
    
    const messageType = getContentType(m.message);

    if (m.key.remoteJid === 'status@broadcast') {
        await statusBroadcastHandler(sock, m);
    } else if (messageType === 'protocolMessage' || messageType === 'reactionMessage') {
        return;
    } else if (messageType === 'channelMessage') {
        await channelHandler(sock, m);
    } else {
        await normalMessageHandler(sock, m, commands);
    }
}