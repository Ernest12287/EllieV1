export const quranCommand = {
    name: 'quran',
    description: 'Get Quran verses',
    usage: '.quran <surah>:<verse>',
    category: 'Quran',

    async execute(sock, message, args) {
        const jid = getChatJid(message);
        if (!args[0]) {
            await sock.sendMessage(jid.chat, {
                text: `❌ Usage: .quran <surah>:<verse>\nExample: .quran 1:1`
            });
        }

        try {
            const [surah, verses] = args[0].split(':');
            let startVerse, endVerse;
            if (verses.includes('-')) {
                [startVerse, endVerse] = verses.split('-').map(Number);
            } else {
                startVerse = endVerse = Number(verses);
            }

            let messageText = `📖 *Quran - Surah ${surah}*\n\n`;

            for (let v = startVerse; v <= endVerse; v++) {
                const res = await fetch(`https://api.quran.sutanlab.id/surah/${surah}/${v}`);
                const data = await res.json();
                if (data.status === "OK") {
                    const ayah = data.data;
                    messageText += `*Verse ${v}*\n${ayah.text.arab}\n_${ayah.text.id}_\n\n━━━━━━━━━━━━━━\n\n`;
                } else {
                    messageText += `❌ Verse ${v} not found\n\n`;
                }
                // Send in chunks if too long
                if (messageText.length > 3000) {
                    await sock.sendMessage(jid.chat, { text: messageText });
                    messageText = `📖 *Quran - Surah ${surah} (Continued)*\n\n`;
                }
            }

            if (messageText.length > 50) {
                await sock.sendMessage(jid.chat, { text: messageText });
            }

        } catch (err) {
            await sock.sendMessage(jid.chat, {
                text: `❌ Error fetching verse: ${err.message}\nRead online: https://quran.com/${args[0].replace(':', '/')}`
            });
        }
    }
};
