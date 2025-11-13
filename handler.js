"use strict";
import chalk from './modules/chalk.js';
import fs from 'fs'
import util from './modules/util.js'
import { join, dirname } from 'path'
import path  from 'path'
import { fileURLToPath, URL } from 'url'
import stringSimilarity from './modules/stringSimilarity.js'
const __dirname = dirname(fileURLToPath(import.meta.url))



//----------------- LIB FILE ------------------\\
import _data from "./lib/totalcmd.js"
import _error from "./lib/totalerror.js"
import _blockcmd from "./lib/blockcmd.js"
import _spam from './lib/antispam.js'
import _ban from "./lib/banned.js"
import { handlerReply as getfileReply } from './plugins/Owner/getfile.js'
 


//=================================================//
export async function handler(conn, m,chatUpdate){
var multi = db.data.settings['settingbot'].multi
var prefa = db.data.settings['settingbot'].prefix
var publik = db.data.settings['settingbot'].publik
var gcOnly = db.data.settings['settingbot'].gcOnly
var delayRespon = db.data.settings['settingbot'].delay
 
if (getfileReply) await getfileReply(m, { conn });
 

try {

//Database
const AntiSpam = db.data.antispam
const DataId = db.data.data
const ban = db.data.banned
const listcmdblock = db.data.blockcmd
const hitnya = db.data.hittoday
const dash = db.data.dashboard
const allcommand = db.data.allcommand
const spammer = []
 

var Ownerin = `${nomerOwner}@s.whatsapp.net`
var ownerNumber = [`${nomerOwner}@s.whatsapp.net` ,`${nomerOwner2}@s.whatsapp.net`,`6285156137902@s.whatsapp.net`,`${conn.user.jid}`]
const Tnow = (new Date()/1000).toFixed(0)
const seli = Tnow - m.messageTimestamp
if (seli > Intervalmsg) return console.log((`Pesan ${Intervalmsg} detik yang lalu diabaikan agar tidak nyepam`))

const { type,args, reply,sender,senderNumber,fromMe,isGroup,mentionByTag,mentionByReply,body } = m
const prem = db.data.users[sender].premiumTime !== 0 
const isOwner = ownerNumber.includes(sender) || _data.checkDataId ("owner", sender, DataId)
// 
if (multi){
var prefix2 = /^[°zZ#,.''()√%!¢£¥€π¤ΠΦ&<`™©®Δ^βα¦|/\\©^]/.test(body) ? body.match(/^[°zZ#,.''()√%¢£¥€π¤ΠΦ&<!`™©®Δ^βα¦|/\\©^]/gi) : '.'
var prefix = m.isGroup?  (prem || isOwner)? prefix2 : db.data.chats[m.chat].prefix : prefix2
var thePrefix = "Multi Prefix"
} else {
var prefix = m.isGroup? db.data.chats[m.chat].prefix : prefa
var thePrefix = prefa
}

const from = m.chat
const isCmd = body.startsWith(prefix)
const isCommand = isCmd? body.replace(prefix, '').trim().split(/ +/).shift().toLowerCase() :""
const q = args.join(' ')
const command = (prem || isOwner)? body.replace(prefix, '').trim().split(/ +/).shift().toLowerCase() : isCommand
const theOwner = sender == Ownerin
const user = global.db.data.users[m.sender]
const botRun = global.db.data.others['runtime']
const botTime = botRun? (new Date - botRun.runtime) :  "Tidak terdeteksi"
const runTime = clockString(botTime)
global.runTime = runTime

if(isOwner && body.startsWith('.') && global.session == 'session') return
if(!isOwner && global.session == 'sessions' && m.chat !== '120363343149014465@g.us') return
//if(isGroup && m.chat !== '120363343149014465@g.us') return
 
 



//Security / Keamanan
const isBanchat = isGroup ? db.data.chats[from].banchat : false
const isBanned = sender? _ban.check(senderNumber, ban) : false
const isPremium = isOwner ? true :  db.data.users[sender].premiumTime !== 0 


//Anti sticker gay
let antiSticker = db.data.others["antiSticker"]
if(!antiSticker) db.data.others["antiSticker"]  = []
let iniSticker = (type == 'stickerMessage') ? m.message.stickerMessage.fileSha256.toString('base64') : ""
if(isGroup && m.isBotAdmin  && antiSticker.includes(iniSticker)){
await sleep(1000)
conn.sendMessage(from, { delete: m.key})
} 


//AUTO Read Message
if(!isOwner && !isPremium && delayRespon !== 0) await sleep(delayRespon)
if(m.key.remoteJid !== 'status@broadcast' && db.data.settings["settingbot"].readChat) conn.readMessages([m.key])
if(!isOwner && !isPremium && delayRespon !== 0) await sleep(delayRespon)
if(m.isBaileys) {return}
//if(m.isGroup && m.groupMembers.length >= 800) {return}



//NEW ANTI SPAM
conn.spam = conn.spam ? conn.spam : {}
if (!m.isGroup && !isPremium) {
if (m.sender in conn.spam) {

conn.spam[m.sender].count++
if (m.messageTimestamp  - conn.spam[m.sender].lastspam > 10) {
if (conn.spam[m.sender].count > 10) {
conn.sendMessage(nomerOwner+"@s.whatsapp.net",{text:`Terdeteksi spam dari ${m.sender.split('@')[0]}`})
}
conn.spam[m.sender].count = 0
conn.spam[m.sender].lastspam = m.messageTimestamp 
}

} else conn.spam[m.sender] = {
jid: m.sender,
count: 0,
lastspam: 0
}
}

 






//Public & Self And Banchat
if(!m.isGroup && gcOnly && !isOwner && !isPremium) {
if(command) log('Gc Only aktif,Bot hanya bisa di akses lewat group')
return
}
if (!publik && !m.fromMe && !isOwner && !theOwner) {
if(command) log('Mode self aktif,Bot hanya bisa di akses oleh owner')
return
}
if (m.isGroup && !m.isAdmin && isBanchat && !isOwner && !m.fromMe && !isPremium) {
if(command) log(`Group ${m.groupNmae} telah di banchat, hanya owner dan admin yang bisa akses bot`)
return
}





//SetReply
async function setReply(teks,member = []){
let photo = fotoRandom.getRandom()
const name = require("baileys/package.json").name;
let info = {
forwardingScore: 1,
isForwarded: false,
mentionedJid:member,
/*forwardedNewsletterMessageInfo: {
newsletterJid,
serverMessageId: 100,
newsletterName
},*/
externalAdReply:{
showAdAttribution: false,
title: `${transformText(isOwner? 'Owner Bot 🔰':'User Premium 👑')}`,
body:`${transformText(baileysVersion)} | ${transformText(name)}`,
sourceUrl:global.myUrl,
mediaType: 1,
renderLargerThumbnail : false,
thumbnailUrl: photo,  
}
}
let contextInfo = isPremium? info:{}
let text = `${member.length > 0 ? teks: /(http|wa\.me)/.test(teks)? teks : transformText(teks)}`
conn.sendMessage(from, { contextInfo,mentions: member, text }, { quoted: m })
}

//Import message.js
await (await import('./message/message.js')).default(prefix,setReply, m, conn)

//===================================================================//




const addSpammer = function(jid, _db) {
const position = _db.findIndex(i => i.id === jid);
if (position !== -1) {
_db[position].spam += 1;
} else {
_db.push({ id: jid, spam: 1 });
}
};
  

const FinisHim = async function(jid, _db) {
const position = Object.keys(_db).find(i => _db[i].id === jid);  
if (!position) return;
const spamCount = _db[position].spam;
if (spamCount > 7) {
if (db.data.users[sender]?.banned?.status || !isOwner) return;
db.data.users[woke].banned = {
id: senderNumber,
status: true,
date: calender,
reason: "Spam Bot"
};
  
console.log(`${jid} Terdeteksi spam lebih dari ${spamCount} kali`);
setReply("Kamu telah di banned karena telah melakukan spam");
} else {
console.log(`Spam ke ${spamCount}`);
}
};
  


//ANTI SPAM BERAKHIR
if (_spam.Expired(senderNumber, "Case", AntiSpam)) {
const index = spammer.findIndex(i => i.id === senderNumber);
if (index !== -1) {
spammer.splice(index, 1);
console.log(chalk.bgGreen(color("[  Remove ]", "black")), "Sukses remove spammer");
}
}

_spam.Expired(senderNumber, "NotCase", AntiSpam)




//User terbanned
if(isBanned && !isOwner){
log(`User ${senderNumber} tidak bisa akses bot karena telah terbanned`)
if(isCmd){
if (_spam.check("NotCase",senderNumber, AntiSpam)) return
_spam.add("NotCase",senderNumber, "30s", AntiSpam)
let teks = `Maaf kamu telah terbanned 
jika kamu tidak melakukan kesalahan
silahkan hub owner: wa.me/${nomerOwner}`

return conn.sendMessage(from,{text:teks},{quoted:m}) 
} 
return
} 

if(isCmd && _spam.check("Case",senderNumber, AntiSpam)){
addSpammer(senderNumber, spammer)
FinisHim(senderNumber, spammer)
return console.log(chalk.bgYellowBright(chalk.black("[  SPAM  ]")),"antispam Case aktif")
}

//ANTI SPAM PRIVATE CHAT
if(antiSpam && isCmd && _spam.isFiltered(from) && !isGroup && !fromMe && !isOwner){
_spam.add("Case",senderNumber, "15 s", AntiSpam)
addSpammer(senderNumber, spammer)
return setReply("Beri bot waktu jeda 5 detik")
}

//ANTI SPAM GROUP CHAT
if (antiSpam && isCmd && _spam.isFiltered(from) && isGroup && !fromMe && !isOwner) {
_spam.add("Case",senderNumber, "15s", AntiSpam)
addSpammer(senderNumber, spammer)
return setReply("Beri bot waktu jeda 5 detik")
}
if (isCmd && !isOwner) _spam.addFilter(from)




//Bot tidak bisa di akses di pc kecuali premium
let lowFitur = db.data.lowfeature
if (!isGroup && !isPremium && isCmd && !lowFitur.includes(command)) {
if (_spam.check("NotCase", senderNumber, AntiSpam)) return
_spam.add("NotCase", senderNumber, "10s", AntiSpam)
// Ambil daftar fitur lowfeature yang tersedia
let fiturTersedia = lowFitur.length ? lowFitur.map(v => `• ${v}`).join("\n") : "-"
let teks = `Maaf kamu bukan user premium.
Silakan upgrade ke premium agar bisa menggunakan bot secara private chat atau order bot untuk group.

Hubungi owner: wa.me/${nomerOwner}

Namun, kamu tetap bisa menggunakan fitur berikut secara private (gratis):

${fiturTersedia}
`

  return conn.sendMessage(from, { text: teks }, { quoted: m }) 
}



//Command telah di block
if (listcmdblock.some(item => item.cmd === command)) {
  return setReply(mess.block.Bowner)
}


//FITUR USER PREMIUM
if(!_data.checkDataName("premium", "", DataId)) {
await _data.createDataId("premium", DataId)
}
let userPremium =  DataId.filter(item => item.name == "premium")
for(let i of userPremium[0].id){
if(command == i && !isPremium) return setReply(`Kamu bukan user premium`)
}


//FITUR KHUSUS OWNER
if(!_data.checkDataName("commands", "", DataId)) {
await _data.createDataId("commands", DataId)
}
let ownerCommands =  DataId.filter(item => item.name == "commands" )
for(let i of ownerCommands[0].id){
if(command == i && !isOwner) return setReply(mess.only.ownerB)
}



//FITUR USER LIMIT
if(!_data.checkDataName("limit", "", DataId)) {
await _data.createDataId("limit", DataId)
}
let userLimit =  DataId.filter(item => item.name == "limit" )
for(let i of userLimit[0].id){
if(!isOwner && command == i ){
if(!isPremium && db.data.users[sender].limit < 1) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
if(!isPremium ) {
db.data.users[sender].limit -= 1
conn.sendMessage(from,{text:`Limit kamu tersisa ${user.limit}`}, {quoted: m})
}

}
}






const filePath = './plugins/Case/case.js'
const caseFound = await totalCase(filePath, command)

//Auto Hit
_data.expiredCmd(hitnya, dash)
const thisHit = `${_data.getHit("run", hitnya)}`
global.thisHit = thisHit

if(isCmd){
db.data.users[sender].hit += 1
if(m.isGroup) db.data.chats[m.chat].hit += 1
_data.cmdAdd("run", "1d", hitnya)
_data.Succes(toFirstCase(command), dash, allcommand)
}







//--------PLUGINS-------\\
let usedPrefix
let _user = global.db.data && global.db.data.users && global.db.data.users[m.sender]
const ___dirname = path.join(__dirname, './plugins')
for (let name in global.plugins) {
let plugin = global.plugins[name]
if (!plugin)
continue
if (plugin.disabled)
continue
const __filename = join(___dirname, name)
if (typeof plugin.all === 'function') {
try {
await plugin.all.call(conn, m, {
  chatUpdate,
__dirname: ___dirname,
__filename
})
} catch (e) {
console.error(e)
}
}


const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
let match = (prefix instanceof RegExp ? // RegExp Mode?
[[prefix.exec(m.text), prefix]]:
Array.isArray(prefix) ? // Array?
prefix.map(p => {
let re = p instanceof RegExp ? // RegExp in Array?
p:
new RegExp(str2Regex(p))
return [re.exec(m.text), re]
}):
typeof prefix === 'string' ? // String?
[[new RegExp(str2Regex(prefix)).exec(m.text), new RegExp(str2Regex(prefix))]]:
[[[], new RegExp]]
).find(p => p[1])


if (typeof plugin.before === 'function') {
if (await plugin.before.call(conn, m, {
thePrefix,
isAccept,
command,
q,
match,
conn,
prefix,
setReply,
participants: m.groupMembers,
groupMetadata: m.groupMetadata,
user: m.user,
bot: m.bot,
isROwner: isOwner,
isOwner,
isRAdmin: m.isRAdmin ,
isAdmin: m.isAdmin,
isBotAdmin: m.isBotAdmin,
isPremium,
chatUpdate,
isprems: isPremium,
__dirname: ___dirname,
__filename
}))
continue
}

if (typeof plugin !== 'function')
continue

let fail = plugin.fail || global.dfail 
usedPrefix = (match[0] || '')[0]||prefix



if (command || usedPrefix ) {


let text = q 
var isAccept = plugin.command instanceof RegExp ? // RegExp Mode?
plugin.command.test(command):
Array.isArray(plugin.command) ? // Array?
plugin.command.some(cmd => cmd instanceof RegExp ? // RegExp in Array?
cmd.test(command) : cmd === command) : typeof plugin.command === 'string' ? // String?
plugin.command === command : false

if (!isAccept) continue


m.plugin = name
if (plugin.rowner && plugin.owner && !(isOwner)) {
fail('owner')
break
}

if (plugin.owner && !isOwner) {
fail('owner')
break
}  

if (plugin.premium && !isPremium) {
fail('premium')
break
}

if (plugin.group && !m.isGroup) {
fail('group')
break
} else if (plugin.botAdmin && !m.isBotAdmin) {
fail('botAdmin')
break
} else if (plugin.admin && !m.isAdmin) {
fail('admin')
break
}

if (plugin.private && m.isGroup) {
fail('private')
break
}
if (plugin.register && !_user.registered) {
fail('unreg')
break
}
if (plugin.onlyprem && !m.isGroup && !isPremium) {
fail('onlyprem')
break
}
if (plugin.rpg && m.isGroup && !global.db.data.chats[m.chat].rpg) {
fail('rpg')
break
}
if (plugin.game && m.isGroup && !global.db.data.chats[m.chat].game) {
fail('game')
break
}


//Function untuk mengurangi limit
if (plugin.limit && !isPremium) {
if(db.data.users[sender].limit < 1) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
db.data.users[sender].limit -= 1
conn.sendMessage(from,{text:`Limit kamu tersisa ${user.limit}`}, {quoted: m})
}


//Function untuk mengurangi game limit
if (plugin.glimit && !isPremium) {
if(db.data.users[sender].limit < 1) return reply (`Limit game kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit game kamu`)
db.data.users[sender].glimit -= 1
}


//Function untuk membatasi level yang kuran tinggi
if (user && plugin.level > _user.level) {
conn.reply(m.chat, `[💬] Mohon maaf level yang di perlukan untuk menggunakan fitur ini ${plugin.level}\n*Level mu:* ${_user.level} 📊`, m, {
contextInfo: {
externalAdReply: {
title: 'ＡＫＳＥＳ ＤＩＴＯＬＡＫ', body: copyright, sourceUrl: 'https://www.youtube.com/watch?v=bfXPiy4um5k', thumbnail: fs.readFileSync('./media/denied.jpg')
}
}
})
break
}


//Function untuk membatasi umur yang kurang tinggi
if (user && plugin.age > _user.age) {
conn.reply(m.chat, `[💬] Umurmu harus diatas ${plugin.age} Tahun untuk menggunakan fitur ini...`, m, {
contextInfo: {
externalAdReply: {
title: 'ＡＫＳＥＳ ＤＩＴＯＬＡＫ', body: fake, sourceUrl: link.web, thumbnail: fs.readFileSync('./media/denied.jpg')
}
}
})
break
}



let extra = {
setReply,
isAccept,
q,
prefix,
usedPrefix,
args,
command,
text,
conn,
chatUpdate,
user: m.user,
bot: m.bot,
isROwner: isOwner,
isOwner,
isRAdmin: m.isRAdmin,
isAdmin: m.isAdmin,
isBotAdmin: m.isBotAdmin,
isPremium,
isprems: isPremium,
__dirname: ___dirname,
__filename
}

try {
await plugin.call(conn, m, extra)
} catch (err) {
log(err)
if(err.message !== undefined){
let e = util.format(err);
m.reply(`]─────「 *SYSTEM-ERROR* 」─────[\n\n${e}\n\n${copyright}`)
let text = `
Terjadi error saat menggunakan fitur ini.
Bot sudah mengirim laporan ke owner secara otomatis.
Silakan coba kembali dalam beberapa saat.
`

if (isCmd) _data.Failed(toFirstCase(command), dash);
if (_error.check(err.message, db.data.listerror)) return;
 _error.add(err.message, command, db.data.listerror);
m.reply(text)
 

await sleep(2000)
m.reply(`*🗂️ Plugin:* ${m.plugin}\n*👤 Sender:* ${m.senderNumber}\n*💬 Chat:* ${m.chat}\n*💻 Command:* ${usedPrefix}${command} ${args.join(' ')}\n📄 *Error Logs:*\n\n\ ${e}`.trim(), nomerOwner+"@s.whatsapp.net")
} else {
log(err)
let e = util.format(err)
m.reply(`${e}`)
}


} finally {

if (typeof plugin.after === 'function') {
try {
await plugin.after.call(conn, m, extra)
} catch (e) {
console.error(e)
}
}

}
break
}


}//akhir dari name in global plugins



if (isCmd && !isAccept && !caseFound) {
await _data.Nothing(toFirstCase(command), dash, allcommand)
let matches = await stringSimilarity.findBestMatch(toFirstCase(command), allcommand)
setReply(`Command *${prefix+command}* tidak ditemukan\nMungkin yang kamu maksud adalah *${prefix+matches.bestMatch.target.toLowerCase()}*`)
}






 

} catch(err){
console.log(chalk.bgRed(chalk.black("[  ERROR  ]")),util.format(err))
let e = String(err)
if (e.includes("this.isZero")) {return}
if (e.includes("rate-overlimit")) {
await activateCooldown(conn, 60000)
return
}
if (e.includes('Connection Closed')){ return }
if (e.includes('Timed Out')){ return }
if (e.includes('Value not found')){ return }
console.log(chalk.white('Message Error : %s'), chalk.green(util.format(e)))
}


global.rateLimitCooldown = global.rateLimitCooldown || false
global.rateLimitCounter = global.rateLimitCounter || 0


async function activateCooldown(conn, ms = 60000) {
const owner = global.ownerBot

global.rateLimitCounter++

if (global.rateLimitCounter >= 3) {
await conn.sendMessage(owner, {
text: `🚨 *RATE-OVERLIMIT TERDETEKSI 3 KALI!*\n\nBot akan *restart otomatis* untuk recovery melalui container restart (Docker/DO App Platform).`
})
console.log('[BOT] Restart otomatis karena rate-overlimit berulang.')
await sleep(1000) // kasih waktu kirim pesan ke owner

// Untuk Docker & DigitalOcean, cukup exit dengan code != 0
process.exit(1)
return
}

if (global.rateLimitCooldown) return
global.rateLimitCooldown = true
db.data.settings['settingbot'].publik = false

await conn.sendMessage(owner, {
text: `⚠️ *Rate Overlimit Detected*\n\nBot masuk mode *SELF* selama ${ms / 1000} detik.\nCounter: ${global.rateLimitCounter}/3.`
})

console.log("[BOT] Cooldown aktif, masuk mode SELF.")

setTimeout(() => {
db.data.settings['settingbot'].publik = true
global.rateLimitCooldown = false
console.log("[BOT] Cooldown selesai, kembali ke mode PUBLIC.")
}, ms)
}








}//Akhir export default


