
import chalk from '../../modules/chalk.js';
import moment from '../../modules/moment.js'
import util from '../../modules/util.js'
import * as logs from './logs.js'
import _time from "../../lib/grouptime.js";


//----------------- LIB FILE ------------------\\
import _data from "../../lib/totalcmd.js"
import _error from "../../lib/totalerror.js"
import _blockcmd from "../../lib/blockcmd.js"
import _spam from '../../lib/antispam.js'
import _ban from "../../lib/banned.js"
import liteStore from '../../modules/liteStore.js'

import {randomNomor } from "../../lib/myfunc.js"


let handler = (m) => m;
handler.before = async function (m, { conn, q,isPremium, command, setReply, isOwner,prefix,store }) {
  
  try{
  //Database 
  const AntiSpam = db.data.antispam;
  const DataId = db.data.data;
  const ban = db.data.banned;
  const listcmdblock = db.data.blockcmd;
  const listerror = db.data.listerror;
  const hitnya = db.data.hittoday;
  const dash = db.data.dashboard;
  const anonChat = db.data.anonymous;
  const allcommand = db.data.allcommand;
  const setTime = db.data.others["setTime"];
  const spammer = [];
  const store = liteStore
  
  const { type,args, reply,sender,ucapanWaktu,botNumber,senderNumber,groupName,groupId,groupMembers,groupDesc,groupOwner,pushname,itsMe,isGroup,mentionByTag,mentionByReply,mention,budy,content,body } = m
  var Ownerin = `${nomerOwner}@s.whatsapp.net`

  const from = m.chat
  const isCmd = m.body.startsWith(prefix);
  const chat = global.db.data.chats[m.chat];
  const settings = global.db.data.settings["settingbot"];
  const timeWib = moment().tz('Asia/Jakarta').format('HH:mm:ss')
  const user = global.db.data.users[m.sender]
  const numberQuery = q.replace(new RegExp("[()+-/ +/]", "gi"), "") + `@s.whatsapp.net`
 // const Input = m.mentionByTag[0]? m.mentionByTag[0] : m.mentionByReply ? m.mentionByReply : q? numberQuery : false
 const Input = m.isGroup? mentionByTag[0]? mentionByTag[0] : mentionByReply ? mentionByReply : q? numberQuery : false : false







  
//Import allfake.js
await (await import('./allfake.js')).default(m)
  //Presence Online
  if (isCmd) {
    db.data.users[m.sender].exp += Math.floor(Math.random() * 10) + 50;
    conn.sendPresenceUpdate("composing", m.chat);
  } else {
    conn.sendPresenceUpdate("available", m.chat);
  }
  
 
//Type data
const isReaction = (m.type == 'reactionMessage')
const isAllMedia = (m.type === 'imageMessage' || m.type === 'videoMessage' || m.type === 'stickerMessage' || m.type === 'audioMessage' || m.type === 'contactMessage' || m.type === 'locationMessage')
const isSticker = (type == 'stickerMessage')


//Console log
if(!isCmd && !isAllMedia && !isReaction && m.budy.length < 8000 && m.type !== 'protocolMessage') logs.message(conn,m,m.budy,AntiSpam)
if(isCmd || isPremium && allcommand.includes(toFirstCase(command))) logs.commands(m,command,q,isCmd)




  //--------System Expired-------\\
  _time.running(setTime);

    











  try{
  switch (command) {

    case ">":
      case "c":
      {
        if (!isOwner) return setReply(mess.only.owner);
        try {
          let evaled = await eval(q);
          if (typeof evaled !== "string")
            evaled = util.inspect(evaled);
          m.reply(evaled);
        } catch (err) {
          m.reply(String(err));
        }
      }
      break;

    case '=>':
      {
        if (!isOwner) return setReply(mess.only.owner);
        try {
          let evaled = await eval(`(async () => { ${q} })()`);
          if (typeof evaled !== "string")
            evaled = util.inspect(evaled);
          await setReply(evaled);
        } catch (err) {
          await setReply(String(err));
        }
      }
      break;


 

 





    
 


 
  

    //------------------------ BATAS DARI AREA CASE -----------------------------\\
    default:
  } //Akhir switch command



} catch (err){
  //add to dashboard
if(isCmd) _data.Failed(toFirstCase(command), dash)
let e = util.format(err)

if(err.message.includes("Cannot find module")){
let module = err.message.split("Cannot find module '")[1].split("'")[0]
let teks = `Module ${module} belom di install
silakan install terlebih dahulu`
return setReply(teks)
}

await setReply(`]─────「 *SYSTEM-ERROR* 」─────[\n\n${e}\n\n${copyright}`)
if(_error.check(err.message, db.data.listerror)) return
_error.add(err.message, command, db.data.listerror)

let media = 'tidak ada'

if(q.length > "0"){
var tetek = q
} else if(q.length == "0"){
var tetek = "No Query ❌"
}

if (isGroup && m.isBotAdmin) {
let linkgc = await conn.groupInviteCode(from)
var yeh = `https://chat.whatsapp.com/${linkgc}`
} else if(isGroup && !m.isBotAdmin){
var yeh = `Botz Is Not Admin`
} else if(!isGroup){
var yeh = `Botz Is Not In The Group`
}

let teks =`
*]───── 「 Laporan Bug ⚠️」 ─────[*

👤 Nama : ${pushname}
📳 Nomer : wa.me/${senderNumber}
📢 Info Laporan :
         _${e}_
🔖 Command : ${prefix}${command}
⏰Time : ${timeWib} Wib
📝 Query : ${tetek}
🧩 Quoted : ${media}
💠 Group : ${isGroup?`${groupName}`:'Di private chat'}
🆔 ID : ${from}
🌐 Link Group : ${yeh}
  
  
`
await conn.sendMessage(Ownerin, {text:teks} , {quoted: fkontak})
await conn.sendMessage(from,{ text: "Laporan error telah dikirim ke Developer Botz"})

}







} catch(err){
  console.log(chalk.bgYellow(chalk.black("[ ERROR CASE ]")),util.format(err))
  }
};
export default handler;
