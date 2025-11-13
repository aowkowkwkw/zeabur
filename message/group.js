
import moment from '../modules/moment.js'
import chalk from '../modules/chalk.js';
import util from '../modules/util.js'


//Function update member
export const memberUpdate = async (conn, anu) => {
 log(anu)
if(global.session == 'sessions') return
await sleep(3000)
try {

  let { id, author,participants, action } = anu;
  //if(id !== '120363402663481730@g.us') return
  if(author == undefined) author = null
  if(participants[0] == author) return log('nomer bot sendiri yang ngekick')
  const myGroup = Object.keys(db.data.chats);
  const botNumber = conn.decodeJid(conn.user.id || conn.user.jid);
  const chat = db.data.chats[id]
  const from = id
  const groupMetadata = 
  participants[0].endsWith('@lid') && action == 'add'? await conn.groupMetadata(from).catch(_ => null) : 
  participants[0].endsWith('@lid') && action == 'remove'? (((conn.chats[from] || {}).metadata || await conn.groupMetadata(from).catch(_ => null))) || null :   
 (conn.chats[from] || {}).metadata || await conn.groupMetadata(from).catch(_ => null)
if(groupMetadata == null) return log('metadata: null, mungkin bot abis di culik')
  //  log(groupMetadata)
  const addressingMode = groupMetadata.addressingMode
  const isCommunity = id.endsWith('@g.us') && !!groupMetadata.parent
   const isCommunity1 = id.endsWith('@g.us') && groupMetadata.isCommunity
    const isCommunity2 = id.endsWith('@g.us') && groupMetadata.isCommunityAnnounce
  if(isCommunity) return log('Bukan group tapi isCommunity')
    if(isCommunity1) return log('Bukan group tapi isCommunity1')
      //if(!isCommunity2) return log('Bukan group tapi isCommunity2')
 
  const members = 
addressingMode == 'lid'? (groupMetadata.participants.map(p => ({lid: p.id,id:  p.jid ||p.phone || p.phoneNumber ,admin: p.admin})) || []) : 
addressingMode == 'lid-update'? groupMetadata.participants : groupMetadata.participants 

//log(addressingMode)
  
  const targetId = 
  participants[0].endsWith('@lid') && (action == 'add' || action == 'remove' || action == 'promote' || action == 'demote')? members.find(p => p.lid === participants[0])?.id || participants[0] : participants[0] 
  const targetah = 
  (author && author.endsWith('@lid') && (action == 'add' || action == 'remove' || action == 'promote' || action == 'demote'))
    ? members.find(p => p.lid === author)?.id || author
    : author == null
      ? targetId
      : author;

  const sender = conn.decodeJid(targetId)//132345273258041_1@s.whatsapp.net
  author = conn.decodeJid(targetah)
log(author)
 // log(sender)
  const groupMembers = members
  const groupName = groupMetadata.subject || ''
  //if(sender.includes('_')) return log('log 3')
  const senderNumber = sender.split("@")[0];
  const groupDesc = groupMetadata.desc || [];
  const bot = groupMembers.find((u) => conn.decodeJid(u.id) == conn.user.jid) || {};
  const isOwner = sender.split('@')[0] === nomerOwner 
  const isBotAdmin = (bot && bot.admin == "admin") || false; // Are you Admin?
  const pushname = await conn.getName(sender);
  const oneMem = participants.length === 1;
  const itsMe = sender === botNumber;
  const timeWib = moment.tz("Asia/Jakarta").format("HH:mm");
  const add = action == "add";
  const remove = action == "remove";
  const isBanchat = myGroup.includes(from)? db.data.chats[from].banchat: false;

 
 // if (!dataChat) return;
  
  
  
  if (action === "demote") {

    for (const participant of members) {
      if (participant.id === sender) {
        participant.admin = null;
        log(`promote ${sender.split('@')[0]}`)
      }
    }
  
  } else if (action === "promote") {

    for (const participant of members) {
      if (participant.id === sender) {
        participant.admin = 'admin';
        log(`promote ${sender.split('@')[0]}`)
      }
    }
  
  } else if (action === "add") {

    if(conn.chats[id] && conn.chats[id]?.metadata.addressingMode == 'lid-update'){
      conn.chats[id].metadata.participants.push({ lid: participants[0], id: sender, admin: null });
    }
     
    const exists = members.some(m => m.id === sender);
    if (!exists) members.push({ id: sender, admin: null });
  
    const botJid = conn.decodeJid(conn.user?.id || conn.user?.jid);
    const bot = members.find(u => conn.decodeJid(u.id) === botJid);
    const isBotAdmin = bot?.admin === 'admin';
  
  
    if (isBotAdmin && sender.split('@')[0] === global.nomerOwner) {
      await conn.groupParticipantsUpdate(id, [sender], 'promote');
    }
  
  } else if (action === "remove") {
    // Update metadata: hapus user dari list participant
    if(addressingMode == 'lid-update') {
      conn.chats[id].metadata.participants = conn.chats[id].metadata.participants.filter(p => p.id !== sender);
    } else groupMetadata.participants = members.filter(p => p.id !== sender);
  
    const botJid = conn.decodeJid(conn.user?.id || conn.user?.jid);

    if (sender === botJid && chat) {
      // Bot dikeluarkan
      const groupName = groupMetadata.subject || 'Tidak diketahui';
      const groupId = id;
      const totalMember = groupMetadata.participants?.length || 0;
      const kickedBy = sender  
    
      // Cari admin grup
      let adminList = groupMetadata?.participants?.filter(p => p.admin)?.map(p => p.id) || [];  
      if (adminList.length > 0 ) {


          for (let admin of adminList) {
              let nameAdmin;
              try {
                  nameAdmin = conn.getName ? await conn.getName(admin) : admin.split('@')[0];
              } catch {
                  nameAdmin = admin.split('@')[0];
              }
              
let apologize = `🙏🏻 *Halo kak!* \n\n` +
                `Maaf ya, tadi aku baru aja di *tendang* dari grup *${groupName}* 😭.\n\n` +
                `Terima kasih banyak udah sempet ngasih kesempatan buat gabung dan bantu-bantu di grup!\n` +
                `Kalau ada salah kata, spam, atau fitur bot yang kurang berkenan, aku mohon maaf sebesar-besarnya 🙏🏻.\n\n` +
                `Semoga grupnya makin rame, berkah, dan sukses terus! 🚀🔥`;
                await sleep(3000);
                await conn.sendMessage(admin, { text: apologize });

          }


                // Kirim laporan ke owner bot
let notif = `🚫 *Bot telah dikeluarkan dari grup!*\n\n` +
            `📛 *Nama Grup:* ${groupName}\n` +
            `🆔 *ID Grup:* ${groupId}\n` +
            `👥 *Jumlah Member:* ${totalMember}\n` +
            `👤 *Pelaku:* ${author.split('@')[0]}\n` +
            `📤 *Status:* Grup dihapus dari cache.`;

 
await sleep(3000);
await conn.sendMessage(global.ownerBot, {text: notif,mentions: [kickedBy]});

delete conn.chats[id]; // Hapus dari memori
console.log(`Bot dikeluarkan dari grup ${groupName} (${groupId}) oleh ${kickedBy}`);


      }
  

  }
  
  }
  


  







let text = 'Siapa yang ngekick gua anjir, lagi enak" main ama member tiba" di kick bangke'
if(action == 'add' && sender === botNumber && chat && author !== null ) conn.reply(from,text)
if(sender.includes('@lid')) return log('log 1: user ')
if (["remove", "promote", "demote"].includes(action) && sender === botNumber) return log('log 2: ini adalah bot');
if (isBanchat) return log('log 4: bot di banchat sehingga tidak bisa kirim pesan')
if (!chat) return log('log 5: tidak ada database pada group ini di db')





//if (!chat.welcome) return log('log 6')
let sBye = chat.sBye;
let sWelcome = chat.sWelcome;

//Group Update Console.log
if (add && oneMem)
console.log(chalk.magenta("[GRUP UPDATE]"),chalk.green(`${pushname} telah bergabung dari gc`),chalk.magenta(`${groupName}`));
if (remove && oneMem)
console.log(chalk.magenta("[GRUP UPDATE]"),chalk.green(`${pushname} telah keluar di gc`),chalk.magenta(`${groupName}`));

//Auto kick jika itu user yang sudah di tandai
let kickon = db.data.kickon[from];
if (add && kickon && kickon.includes(senderNumber)) {
let teks = `@user tidak di izinkan masuk
karena dia telah keluar dari group ini sebelumnya,
dan juga sudah di tandai sebagai user biadap`;
let text = teks.replace("user", await conn.getName(sender));

await conn.sendMessage(from,{ text,mentions: [sender],contextInfo: { mentionedJid: [sender] }},);
if (!isBotAdmin) return conn.sendMessage(from,{text: `Gagal  mengeluarkan @${senderNumber} dari group karena bot bukan admin`,contextInfo: { mentionedJid: [sender] }});
if (isBotAdmin) return conn.groupParticipantsUpdate(from, [sender], "remove")
}

 

let welcome ='https://telegra.ph/file/e90a359b95411b120c635.jpg' 
let goodbye = 'https://telegra.ph/file/57355c93403c36dbf2ca4.jpg' 
 

if (action == "add") {
var link = chat.welcomeImage == ''? welcome : chat.welcomeImage
} else {
var link = chat.leaveImage == ''? goodbye : chat.leaveImage
}



const botRun = global.db.data.others['runtime']
const botTime = botRun? (new Date - botRun.runtime) :  "Tidak terdeteksi"
const runTime = clockString(botTime)
 

let contextInfo = {
forwardingScore: 1,
isForwarded: false,
mentionedJid: [sender],
forwardedNewsletterMessageInfo: {
newsletterJid,
serverMessageId: 100,
newsletterName
},
externalAdReply:{
showAdAttribution: false,
title: `${action == "add"? 'W E L C O M E': 'G O O D  B Y E'}`,
body:`Runtime ${transformText(runTime)} `,
sourceUrl:global.myUrl,
mediaType: 1,
renderLargerThumbnail : true,
thumbnailUrl: link,
}
}







switch (action) {

case "add":{
if (!chat.welcome) return   
let teks = `Halo @user
welcome to group ${groupName}
${sWelcome}`;
const welcomeText = (chat.sWelcome || teks)
.replace("user", await conn.getName(sender))
.replace("@desc", groupDesc.toString() || "unknow")
.replace("@subject", groupName);


 
let data = isOwner? groupMetadata.participants : {}
let member = isOwner? data.filter(u => u.admin !== 'admin' || u.admin !== 'superadmin' ) : {}
let admin = isOwner? data.filter(u => u.admin === 'admin' || u.admin === 'superadmin' ) : {}

const welcometeks =`Yeeeaaay ownerku masuk group!!

Halloo ${conn.getName(sender)}
welcome to group ${groupName} 
total member : ${member.length} member 
total admin : ${admin.length} admin


${copyright} - ${calender}
`
if (chat.welcome && !itsMe && oneMem) conn.sendMessage(from,{ text: isOwner? welcometeks:welcomeText, mentions: [sender],contextInfo})
}
break;

case "remove":
{
if (!chat.welcome) return 
let teks = `Selamat tinggal @user
${sBye}`;
const byeText = (chat.sBye || teks)
.replace("user", await conn.getName(sender))
.replace("@desc", groupDesc.toString() || "unknow")
.replace("@subject", groupName);

const byeTeks =`Bye bye owner, thanks udah mmampir 😁`

if (chat.welcome && !itsMe && oneMem) conn.sendMessage(
from,
{ text:isOwner? byeTeks: byeText,mentions: [sender],
contextInfo
}
);
}
break






} // Akhir dari swith action

await sleep(5000);

} catch (err) {


console.log(err);
let e = String(err);
if (e.includes("this.isZero")) {return;}
if (e.includes("rate-overlimit")) {return;}
if (e.includes("Connection Closed")) {return;}
if (e.includes("Timed Out")) {return;}
console.log(chalk.white("GROUP :"), chalk.green(e));

let text =`
FROM Group.js

${util.format(anu)}


${util.format(err)}`
conn.sendMessage(ownerBot,{text})

}
};



//----------------BATAS--------------\\




//Function Update group
export async function groupsUpdate(conn, anu) {
 
  for (const update of anu) {
    const id = update.id
    const dataChat = conn.chats[id]
    if (!dataChat) continue

    const meta = dataChat.metadata

    if (update.subject) meta.subject = update.subject
    if (update.desc) meta.desc = update.desc
    if (typeof update.restrict !== 'undefined') meta.restrict = update.restrict
    if (typeof update.announce !== 'undefined') meta.announce = update.announce
    if (update.descOwner) meta.descOwner = update.descOwner
    if (update.descTimestamp) meta.descTimestamp = update.descTimestamp

    // Kalau kamu mau kasih notifikasi ke grup bahwa deskripsi berubah, bisa tambah ini:
   // if (update.desc) {
    //  await conn.sendMessage(id, {
    //    text: `📝 Deskripsi grup telah diubah!\n\n📃 *Deskripsi baru:*\n${update.desc}`
    ///  })
   // }
  }

/*

try {
console.log(anu);

const from = anu[0].id
const botNumber = conn.user.jid
const groupMetadata = await conn.groupMetadata(from) || (conn.chats[from] || {}).metadata
const groupName =  groupMetadata.subject || []
const groupLength = groupMetadata.participants.length
const groupMembers =  groupMetadata.participants || []
const groupDesc =  groupMetadata.desc || []
const groupOwner =  groupMetadata.owner || []
const bot = groupMembers.find(u => conn.decodeJid(u.id) == conn.user.jid) || {} // Your Data
const isBotAdmin = bot && bot.admin == 'admin' || false // Are you Admin?

let chats = conn.chats[from], text = ''

for (let i of anu) {
if (!from) continue
if (!chats?.detect) continue
if (i.desc) text = (chats.sDesc || 'Description has been changed to\n@desc').replace('@desc', groupUpdate.desc)
if (i.subject) text = (chats.sSubject || 'Subject has been changed to\n@subject').replace('@subject', groupUpdate.subject)
if (i.icon) text = (chats.sIcon || 'Icon has been changed to').replace('@icon', groupUpdate.icon)
if (i.revoke) text = (chats.sRevoke ||  'Group link has been changed to\n@revoke').replace('@revoke', groupUpdate.revoke)
if (announce ) text = (chats.sAnnounceOn ||  '*Group has been closed!*')
if (!i.announce) text = (chats.sAnnounceOff ||  '*Group has been open!*')
if (i.restrict ) text = (chats.sRestrictOn || '*Group has been all participants!*')
if (!i.restrict ) text = (chats.sRestrictOff || '*Group has been only admin!*')
if (!text) continue
conn.sendMessage(from,{ text})
}

} catch (err) {
console.log(err);
}

*/

}


