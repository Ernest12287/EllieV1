# 🤖 VS Code AI Chat Instructions - Let AI Do The Work!



## 🎯 FOR SIMPLE COMMANDS (Like 8ball, ping, etc)

**Copy this ENTIRE block and paste in VS Code AI:**

```
Update this command file to use the new v7-compatible JID helper.

INSTRUCTIONS:
1. Add this import at the top (after other imports):
   import { getChatJid } from '../utils/jidHelper.js';

2. Find this line:
   const sender = message.key.remoteJid;

3. Replace it with:
   const jid = getChatJid(message);

4. Replace ALL occurrences of 'sender' with 'jid.chat' in the rest of the code

5. Make sure all sock.sendMessage() calls use 'jid.chat' as the first parameter

IMPORTANT: Keep all the rest of the logic exactly the same!
```

---

## 🎯 FOR GROUP COMMANDS (Like tagall, kick, promote)

**Copy this ENTIRE block and paste in VS Code AI:**

```
Update this group command to use v7-compatible JID helpers.

INSTRUCTIONS:
1. Add these imports at the top (after other imports):
   import { getChatJid, isUserAdmin } from '../utils/jidHelper.js';

2. Find this line:
   const sender = message.key.remoteJid;

3. Replace it with:
   const jid = getChatJid(message);

4. Replace group checks:
   - Change: if (!sender.endsWith('@g.us'))
   - To: if (!jid.isGroup)

5. Replace admin checks:
   - Find code that checks: message.key.participant && (p.admin === 'admin' || p.admin === 'superadmin')
   - Replace with: isUserAdmin(groupMetadata, jid.sender)

6. Replace ALL 'sender' with 'jid.chat' for sendMessage calls

7. Replace user number formatting:
   - Change: user.split('@')[0]
   - To: jid.formatJid(user)
   OR
   - Use: jid.senderNumber (for the person who sent the command)

8. Make sure groupMetadata calls use 'jid.chat':
   - await sock.groupMetadata(jid.chat)

IMPORTANT: Preserve all the original logic and error handling!
```

---

## 🎯 FOR COMMANDS WITH MENTIONS (Like tag, profile)

**Copy this ENTIRE block and paste in VS Code AI:**

```
Update this command to use v7-compatible JID helpers with mention support.

INSTRUCTIONS:
1. Add this import at the top (after other imports):
   import { getChatJid } from '../utils/jidHelper.js';

2. Find this line:
   const sender = message.key.remoteJid;

3. Replace it with:
   const jid = getChatJid(message);

4. Replace user JID extraction:
   - Find: const user = message.key.participant || message.key.remoteJid;
   - Replace with: const user = jid.sender;

5. Replace user number extraction:
   - Find: const userNumber = user.split('@')[0];
   - Replace with: const userNumber = jid.senderNumber;

6. Replace ALL 'sender' with 'jid.chat' for sendMessage calls

7. In mentions array, use 'jid.sender' or keep existing mention variables

8. For formatting other users' numbers:
   - Use: jid.formatJid(theirJid)

IMPORTANT: Keep all mention arrays and contextInfo exactly as they were!
```

---

## 🎯 FOR COMMANDS WITH QUOTED/REPLY MESSAGES

**Copy this ENTIRE block and paste in VS Code AI:**

```
Update this reply-based command to use v7-compatible JID helpers.

INSTRUCTIONS:
1. Add this import at the top (after other imports):
   import { getChatJid } from '../utils/jidHelper.js';

2. Find this line:
   const sender = message.key.remoteJid;

3. Replace it with:
   const jid = getChatJid(message);

4. Replace quoted message checks:
   - Find: message.message?.extendedTextMessage?.contextInfo?.quotedMessage
   - Replace with: jid.hasQuoted
   
5. Replace quoted participant:
   - Find: message.message?.extendedTextMessage?.contextInfo?.participant
   - Replace with: jid.quotedParticipant

6. Replace ALL 'sender' with 'jid.chat' for sendMessage calls

7. Format quoted user numbers:
   - Use: jid.formatJid(jid.quotedParticipant)

IMPORTANT: Keep all quoted message logic and validation!
```

---

## 🎯 BATCH UPDATE ALL COMMANDS AT ONCE

**For the ULTIMATE lazy mode, use this:**

```
I need to update ALL command files in the 'commands' folder to use the new v7-compatible JID helper.

THE HELPER FILE:
Location: utils/jidHelper.js
The getChatJid() function returns an object with these properties:
- jid.chat (where to reply)
- jid.sender (who sent it)
- jid.senderNumber (their number)
- jid.isGroup (boolean)
- jid.isFromMe (boolean)
- jid.formatJid(x) (format any JID)

MIGRATION RULES:
1. Add import: import { getChatJid } from '../utils/jidHelper.js';

2. Replace: const sender = message.key.remoteJid;
   With: const jid = getChatJid(message);

3. Replace all 'sender' variables with 'jid.chat' when used in sock.sendMessage()

4. Replace: message.key.participant || message.key.remoteJid
   With: jid.sender

5. Replace: user.split('@')[0]
   With: jid.senderNumber OR jid.formatJid(user)

6. Replace: sender.endsWith('@g.us')
   With: jid.isGroup

7. Keep ALL other logic unchanged!

Please update one file at a time and show me the changes before applying.
```

---

## 💡 Pro Tips for Using VS Code AI

### Tip 1: One Command at a Time
Open ONE command file, paste instructions, let AI do it, verify, then move to next.

### Tip 2: Use @workspace
If using GitHub Copilot, try:
```
@workspace Update all commands in /commands folder following these rules: [paste instructions]
```

### Tip 3: Verify Changes
After AI updates, check:
- ✅ Import added at top
- ✅ `const jid = getChatJid(message);` is there
- ✅ All `sender` changed to `jid.chat`
- ✅ Code still makes logical sense

