# 📚 EllieV1 Complete Command Reference

Full documentation of all 100+ commands with examples and usage.

**Default Prefix:** `.` (customizable)

---

## 📑 Table of Contents

- [🎮 Fun & Games](#-fun--games)
- [🤖 AI & Chat](#-ai--chat)
- [📥 Downloaders](#-downloaders)
- [🖼️ Image & Media](#️-image--media)
- [🔧 Utility Tools](#-utility-tools)
- [👥 Group Management](#-group-management)
- [📚 Information & Search](#-information--search)
- [🎨 Creative & Text](#-creative--text)
- [🔐 Security & Tools](#-security--tools)
- [⚙️ Bot Management](#️-bot-management)

---

## 🎮 Fun & Games

### `.8ball <question>`
Get predictions from magic 8-ball.

```
.8ball Will I pass my exam?
```

**Response:** Random prediction (Yes/No/Maybe)

---

### `.dare`
Get a random dare challenge.

```
.dare
```

---

### `.dice`
Roll a dice (1-6).

```
.dice
```

---

### `.flip`
Flip a coin (Heads/Tails).

```
.flip
```

---

### `.joke`
Get a random joke.

```
.joke
```

---

### `.meme`
Get a random meme image.

```
.meme
```

---

### `.riddle`
Get a random riddle with answer.

```
.riddle
```

---

### `.rps <choice>`
Play Rock Paper Scissors.

```
.rps rock
.rps paper
.rps scissors
```

---

### `.ship @user1 @user2`
Calculate love compatibility.

```
.ship @Alice @Bob
```

**Response:** Compatibility percentage with message

---

### `.trivia`
Get a random trivia question.

```
.trivia
```

**Response:** Multiple choice question with answer

---

### `.truth`
Get a truth question.

```
.truth
```

---

### `.quote`
Get an inspirational quote.

```
.quote
```

---

### `.advice`
Get random life advice.

```
.advice
```

---

### `.fact`
Get a random interesting fact.

```
.fact
```

---

### `.bully @user`
Roast someone (friendly fun).

```
.bully @John
```

---

## 🤖 AI & Chat

### `.gpt <prompt>`
ChatGPT 3.5 responses.

```
.gpt What is JavaScript?
```

---

### `.gpt4o <prompt>`
GPT-4 Turbo with advanced reasoning.

```
.gpt4o Explain quantum computing in simple terms
```

---

### `.gpt4omini <prompt>`
GPT-4 Mini for quick responses.

```
.gpt4omini Quick math help
```

---

### `.gemini <prompt>`
Google Gemini AI.

```
.gemini Write a short story about robots
```

---

### `.geminipro <prompt>`
Gemini Pro for complex tasks.

```
.geminipro Analyze this code
```

---

### `.groq <prompt>`
Groq AI for fast responses.

```
.groq Tell me a fun fact
```

---

### `.mistral <prompt>`
Mistral AI responses.

```
.mistral Help me with Python
```

---

### `.giftedai <prompt>`
Gifted AI for creative tasks.

```
.giftedai Write a poem about nature
```

---

### `.deepimg <image>`
AI image analysis (reply to image).

```
.deepimg
(Reply to an image)
```

---

### `.vision <image>`
Vision AI for image understanding.

```
.vision
(Reply to an image)
```

---

## 📥 Downloaders

### `.youtube <url>`
Download YouTube videos.

```
.youtube https://youtube.com/watch?v=...
```

**Supported:** Videos up to 100MB

---

### `.ytmp3 <url>`
YouTube to MP3 converter.

```
.ytmp3 https://youtube.com/watch?v=...
```

---

### `.yt <query>`
Quick YouTube search with link.

```
.yt Despacito
```

---

### `.tiktok <url>`
Download TikTok videos (no watermark).

```
.tiktok https://tiktok.com/@user/video/...
```

---

### `.instagram <url>`
Download Instagram posts/reels.

```
.instagram https://instagram.com/p/...
```

---

### `.facebook <url>`
Download Facebook videos.

```
.facebook https://facebook.com/watch?v=...
```

---

### `.twitter <url>`
Download Twitter/X videos.

```
.twitter https://twitter.com/user/status/...
```

---

### `.mediafire <url>`
Download MediaFire files.

```
.mediafire https://mediafire.com/file/...
```

---

### `.apk <app name>`
Search and download APK files.

```
.apk WhatsApp
```

---

### `.download <url>`
Universal media downloader.

```
.download <any-social-media-url>
```

---

### `.xvdown <url>`
Download from adult video site.

```
.xvdown <url>
```

---

### `.xnxdown <url>`
Download from adult video site.

```
.xnxdown <url>
```

---

### `.save`
Save someone's WhatsApp status (reply to status).

```
.save
(In status view)
```

---

## 🖼️ Image & Media

### `.sticker`
Convert image/video/gif to sticker.

```
.sticker
(Send image/video with caption .sticker)
```

**Options:**
- Images → Static sticker
- GIF/Video → Animated sticker

---

### `.toimage`
Convert sticker to image.

```
.toimage
(Reply to sticker)
```

---

### `.fluximg <prompt>`
Generate AI images with Flux.

```
.fluximg A cat astronaut in space
```

---

### `.deepimg <prompt>`
Generate images with DeepAI.

```
.deepimg Futuristic cyberpunk city
```

---

### `.remini`
Enhance image quality (AI upscaling).

```
.remini
(Reply to image)
```

---

### `.removebg`
Remove background from image.

```
.removebg
(Reply to image)
```

---

### `.anime`
Get random anime image.

```
.anime
```

---

### `.waifu`
Get random waifu image.

```
.waifu
```

---

### `.neko`
Get random neko (cat girl) image.

```
.neko
```

---

### `.megumin`
Get Megumin (KonoSuba) images.

```
.megumin
```

---

### `.shinobu`
Get Shinobu (Monogatari) images.

```
.shinobu
```

---

### `.vv`
Download view-once images/videos.

```
.vv
(Reply to view-once message)
```

---

## 🔧 Utility Tools

### `.qr <text/url>`
Generate QR code.

```
.qr https://example.com
.qr Your text here
```

---

### `.weather <city>`
Get weather information.

```
.weather Nairobi
.weather New York
```

**Requires:** WEATHER_API_KEY

---

### `.time <timezone>`
Get current time in any timezone.

```
.time Kenya
.time America/New_York
```

---

### `.calc <expression>`
Calculator.

```
.calc 5 + 5
.calc (10 * 2) + 5
```

---

### `.currency <amount> <from> <to>`
Currency converter.

```
.currency 100 USD KES
.currency 50 EUR GBP
```

---

### `.crypto <symbol>`
Cryptocurrency prices.

```
.crypto BTC
.crypto ETH
```

---

### `.define <word>`
Get word definition.

```
.define serendipity
```

---

### `.dictionary <word>`
Dictionary lookup with examples.

```
.dictionary beautiful
```

---

### `.synonym <word>`
Find synonyms.

```
.synonym happy
```

---

### `.translate <from> <to> <text>`
Translate text.

```
.translate en es Hello world
.translate auto fr Good morning
```

---

### `.shorten <url>`
Shorten URL.

```
.shorten https://very-long-url.com/path/to/page
```

---

### `.tinyurl <url>`
Create TinyURL.

```
.tinyurl https://example.com
```

---

### `.adfoc <url>`
Create AdFocus link.

```
.adfoc https://example.com
```

---

### `.cleanuri <url>`
Clean and shorten URI.

```
.cleanuri https://example.com
```

---

### `.rebrandly <url>`
Create Rebrandly short link.

```
.rebrandly https://example.com
```

---

### `.tempmail`
Generate temporary email.

```
.tempmail
```

---

### `.password <length>`
Generate secure password.

```
.password 16
```

---

### `.proxy`
Get proxy server list.

```
.proxy
```

---

### `.servercheck <domain>`
Check if server is online.

```
.servercheck google.com
```

---

### `.ping`
Check bot latency and uptime.

```
.ping
```

---

## 👥 Group Management

### `.promote @user`
Promote member to admin.

```
.promote @John
```

**Requirements:** Bot must be admin

---

### `.demote @user`
Demote admin to member.

```
.demote @John
```

**Requirements:** Bot must be admin

---

### `.tagall <message>`
Tag all group members.

```
.tagall Hello everyone!
```

---

### `.groupinfo`
Get group information and statistics.

```
.groupinfo
```

---

### `.antitag <on/off> <limit>`
Enable/disable anti mass-tag.

```
.antitag on 10
(Deletes messages tagging more than 10 people)

.antitag off
```

---

### `.antiword <action> <word>`
Manage banned words.

```
.antiword add badword
.antiword remove badword
.antiword list
.antiword off
```

---

### `.announce`
Toggle announcement mode (only admins can send).

```
.announce
```

---

### `.goodbye`
Set goodbye message for group.

```
.goodbye
```

---

### `.fullpp @user`
Get full-size profile picture.

```
.fullpp @John
.fullpp (for bot's PP)
```

---

### `.pp @user`
Get profile picture.

```
.pp @John
```

---

## 📚 Information & Search

### `.wiki <query>`
Wikipedia search.

```
.wiki Artificial Intelligence
```

---

### `.search <query>`
Web search with results.

```
.search NodeJS tutorial
```

---

### `.npm <package>`
NPM package information.

```
.npm express
```

---

### `.github <user/repo>`
GitHub repository information.

```
.github Ernest12287/EllieV1
```

---

### `.movie <title>`
Movie information and ratings.

```
.movie Inception
```

---

### `.lyrics <song>`
Get song lyrics.

```
.lyrics Shape of You
```

---

### `.anime <name>`
Anime information.

```
.anime Naruto
```

---

### `.pokemon <name>`
Pokemon information.

```
.pokemon Pikachu
```

---

### `.nutrition <food>`
Nutrition facts.

```
.nutrition banana
```

---

### `.horoscope <sign>`
Daily horoscope.

```
.horoscope Aries
```

---

### `.verse <reference>`
Bible verse lookup.

```
.verse John 3:16
```

---

### `.quran <reference>`
Quran verse lookup.

```
.quran 1:1
```

---

### `.chapter <number>`
Get Quran chapter.

```
.chapter 1
```

---

### `.urban <term>`
Urban Dictionary lookup.

```
.urban yeet
```

---

## 🎨 Creative & Text

### `.fancy <text>`
Generate fancy text styles.

```
.fancy Hello World
```

---

### `.ttp <text>`
Text to PNG image.

```
.ttp Hello World
```

---

### `.emojimix <emoji1> <emoji2>`
Mix two emojis.

```
.emojimix 😀 😎
```

---

### `.countdown <event>`
Create countdown.

```
.countdown New Year
```

---

### `.topdf`
Convert image to PDF.

```
.topdf
(Reply to image)
```

---

### `.ssweb <url>`
Take website screenshot.

```
.ssweb https://google.com
```

---

### `.ssur <url>`
Alternative website screenshot.

```
.ssur https://example.com
```

---

### `.vgd`
Get video thumbnail.

```
.vgd
(Reply to video)
```

---

### `.convert <value> <from> <to>`
Unit converter.

```
.convert 5 km miles
.convert 100 celsius fahrenheit
```

---

### `.find <query>`
Find a command.

```
.find sticker
```

---

## 🔐 Security & Tools

### `.encrypt <text>`
Encrypt text (Base64).

```
.encrypt My secret message
```

---

### `.encrypt2 <text>`
Encrypt text (Method 2).

```
.encrypt2 Secret text
```

---

### `.encrypt3 <text>`
Encrypt text (Method 3).

```
.encrypt3 Hidden message
```

---

### `.ebinary <text>`
Convert text to binary.

```
.ebinary Hello
```

---

### `.dbinary <binary>`
Convert binary to text.

```
.dbinary 01001000 01100101
```

---

### `.ebase <text>`
Encode to Base64.

```
.ebase Secret message
```

---

### `.dbase <base64>`
Decode from Base64.

```
.dbase U2VjcmV0IG1lc3NhZ2U=
```

---

### `.onion`
Get .onion links (Tor).

```
.onion
```

---

### `.web2zip <url>`
Convert website to zip.

```
.web2zip https://example.com
```

---

## ⚙️ Bot Management

*(Owner Only Commands)*

### `.update`
Update bot from GitHub.

```
.update
```

**Requires:** GITHUB_PAT in .env

**What it does:**
1. Fetches latest code
2. Updates command files
3. Restarts bot automatically

---

### `.public <on/off>`
Toggle public/private mode.

```
.public on   # Bot responds to everyone
.public off  # Bot responds to owner only
.public      # Check current status
```

---

### `.restart`
Restart the bot.

```
.restart
```

---

### `.eval <code>`
Execute JavaScript code.

```
.eval console.log("Hello")
.eval message.key
```

**⚠️ Dangerous! Owner only!**

---

### `.setprefix <prefix>`
Change bot prefix.

```
.setprefix !
.setprefix /
```

---

### `.stop`
Stop the bot.

```
.stop
```

---

### `.stats`
Bot statistics and info.

```
.stats
```

---

### `.info`
Bot information.

```
.info
```

---

### `.menu`
Show categorized command menu.

```
.menu
```

---

### `.help`
Show all commands.

```
.help
```

---

### `.aimenu`
AI commands menu.

```
.aimenu
```

---

## 📊 Command Statistics

```
Total Commands: 100+
Public Commands: 94+
Owner Commands: 6
Categories: 10

Most Used:
1. .sticker
2. .youtube
3. .gpt
4. .weather
5. .download
```

---

## 🎯 Tips & Tricks

### Command Aliases

Some commands have aliases:
```
.trivia = .quiz
.twitter = .twetter
.public = .mode = .private
```

### Batch Operations

Some commands support batch:
```
.sticker (send multiple images in one go)
```

### Reply Context

These commands work with reply:
```
.sticker (reply to image)
.toimage (reply to sticker)
.vv (reply to view-once)
.save (reply to status)
```

### Group Context

These work only in groups:
```
.tagall
.groupinfo
.promote
.demote
.antitag
.antiword
```

---

## 🆘 Getting Help

For command help:
```
.help <command>
.find <keyword>
```

For support:
- 💬 Telegram: [Ernest Tech House](https://t.me/ernesttechhouse)
- 📱 WhatsApp: [Channel](https://whatsapp.com/channel/0029VayK4ty7DAWr0jeCZx0i)
- 📧 Email: peaseernest8@gmail.com

---

**Made with ❤️ by Ernest Pease**

*Last Updated: November 2024*