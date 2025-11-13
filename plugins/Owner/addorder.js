
 
import moment from '../../modules/moment.js'

let handler = async (m, { conn,q, args,setReply, usedPrefix, command }) => {
if(!q) return m.reply('contoh penggunan linkgc|40d')  
let timeWib = moment().tz('Asia/Jakarta').format('DD/MM/YYYY HH:mm');
if(!m.isGroup){

const rex1 = /chat.whatsapp.com\/([\w\d]*)/g;
let LinkGc = q.includes("|")? q.split("|")[0] : q.split(" ")[0]
let Second = q.includes("|")? q.split("|")[1] : q.split(" ")[1]
let code = LinkGc.match(rex1);
if (code == null) return  setReply("No invite url detected.");
let kode = code[0].replace("chat.whatsapp.com/", "");

let groupInfo
try {
  groupInfo = await conn.groupGetInviteInfo(kode)
} catch (e) {
  const errMsg = e?.message || String(e)

  if (errMsg.includes('not-authorized')) {
    return m.reply('⚠️ Bot sudah di-kick, tidak bisa join grup tersebut.')
  } else if (errMsg.includes('revoke') || errMsg.includes('revoked')) {
    return m.reply('⚠️ Link grup sudah *di-revoke* (tidak valid lagi). Minta link baru ke admin grup.')
  } else if (errMsg.includes('full') || errMsg.includes('Group is full')) {
    return m.reply('⚠️ Grup sudah penuh, tidak bisa join.')
  } else {
    return setReply('⚠️ Invalid invite URL atau bot tidak bisa akses link.')
  }
}



var { id, subject,creation,desc,descId,participants,owner,subjectOwner } =  groupInfo

let tagnya = owner == undefined?  subjectOwner == undefined? "" : subjectOwner : owner
var creator = `${owner == undefined? subjectOwner == undefined? "Tidak ada" : "@"+ subjectOwner.split("@")[0]: "@"+ owner.split("@")[0]}`


let contextInfo = {
forwardingScore: 50,
isForwarded: true,
mentionedJid:[tagnya],
externalAdReply:{
showAdAttribution: false,
title: `${fake}`,
body:baileysVersion,
mediaType: 1,
sourceUrl:"https://wa.me/c/6285953938243",
thumbnailUrl: 'https://telegra.ph/file/0aa9d587a19e37a0b0122.jpg'
}
}







try{
 var joinResult = await conn.groupAcceptInvite(kode) 
} catch{
  var joinResult = undefined
}

if(joinResult == undefined ) {
  add(id, subject, LinkGc, Second, true, creator, command)
} else add(id, subject, LinkGc, Second, false, creator, command)
  

let groupMetadata = joinResult == undefined? {} : await conn.groupMetadata(id) 
let data = joinResult == undefined? participants : groupMetadata.participants
let member = data.filter(u => u.admin !== 'admin' || u.admin !== 'superadmin' )
let admin = data.filter(u => u.admin === 'admin' || u.admin === 'superadmin' )
let allMember = data.map(item => item.id)
 


let teks =`
––––––『 *ORDER BOT SUCCESS* 』––––––

🔰 *Group*
• Name: ${subject}
• Creat at:  ${new Date(creation * 1000).toLocaleString()}
• Creator: ${creator}
• Group Id: ${id}
• Admin: ${admin.length}
• Members: ${member.length}
• Days: ${conn.msToDate(conn.toMs(Second))}
• Countdown: ${conn.toMs(Second)}
• Time order: ${timeWib}
• Time end: ${tSewaBerakhir(Date.now() + conn.toMs(Second))}
•·–––––––––––––––––––––––––·•
 
📮 *Note:* ↓
• Bot yang sudah di order tidak dapat di refund
• Ketik .menu untuk mengakses bot
• Ketik .cekorder untuk melihat sisa order
• Lapor ke owner jika bot tidak berfungsi
• Silakan hubungi owner untuk menyewa bot
• Owner wa.me/${nomerOwner}

${copyright} - ${calender}`

await conn.sendMessage(m.chat,{text:teks,mentions:[tagnya]},{quoted:m})

if(joinResult == undefined ){
  if(allMember.includes(m.botNumber)) return m.reply('Berhasil menambahkan waktu sewa')
  await notifyAdminApproval(conn,participants,subject) 
  return m.reply(`Menunggu persetujuan admin group, status ${db.data.chats[id].pending?'Pending':'Sukses'}`)

} 


await sleep(2000)
await conn.sendMessage(id,{text:teks,contextInfo})
} else if(m.isGroup){
if(!q) return setReply("Masukan angka 1m/1d/1h")
if (m.isBotAdmin) {
let linkgc = await conn.groupInviteCode(m.chat)
var yeh = `https://chat.whatsapp.com/${linkgc}`
} else if(!m.isBotAdmin){
var yeh = `Botz Is Not Admin`
}
add(m.chat, m.groupName, yeh, q)
m.reply("Berhasil Add Sewa ke group")
}







// Notifikasi ke Owner jika bot di-approve
async function notifyOwnerApproval(conn, creator) {
  const ownerNotif = `🔔 *BOT APPROVAL NOTIFICATION*\n\nBot telah berhasil diterima oleh admin ke grup! 🎉\n\nGrup: ${subject}\nCreator: ${creator}\n\nBot sekarang aktif dan siap digunakan! 🚀`
  await conn.sendMessage(ownerBot, { text: ownerNotif })
}

// Pesan pembuka setelah bot berhasil join
async function sendOpeningMessage(conn, id, subject) {
  const openingMessage = `📢 *Halo anggota grup ${subject}*\n\nBot resmi telah bergabung untuk membantu mengelola dan mendukung aktivitas grup ini.\n\nGunakan perintah *.menu* untuk melihat semua fitur yang tersedia.\n\nTerima kasih telah mempercayakan kami! 🙏`
  await conn.sendMessage(id, { text: openingMessage })
}


 


// Fungsi untuk mengirim pesan ke admin group
async function notifyAdminApproval(conn,participants, subject) {
  const adminList = participants.filter(u => u.admin === 'admin' || u.admin === 'superadmin')
  if (adminList.length > 0) {
    const adminMentions = adminList.map(a => a.id)
    const notifText = `🚨 *PERHATIAN ADMIN GROUP*\n\nBot tidak dapat langsung bergabung ke grup *${subject}* karena memerlukan persetujuan admin.\n\nMohon segera ACC permintaan masuk agar order aktif.\n\nTerima kasih 🙏`

    for  (let i of adminMentions ){
  await sleep(2000)
  await conn.sendMessage(i, {
    text: notifText,
    mentions: adminMentions
  })
}

  }
}


// Fungsi untuk menghitung tanggal sewa berakhir
function tSewaBerakhir(tanggalSewa){
  const result = moment(tanggalSewa).tz('Asia/Jakarta').format('DD/MM/YYYY HH:mm');
  return result 
}

// Fungsi untuk menambahkan sewa
function add(gid, subject, link, expired, pending = false, creator = 'tidak ada',command) {
  let timeWib = moment().tz('Asia/Jakarta').format('DD/MM/YYYY HH:mm');
  let chat = global.db.data.chats[gid];
  if (chat) {
    chat.expired = Date.now() + conn.toMs(expired) 
    chat.timeEnd = tSewaBerakhir(Date.now() + conn.toMs(expired));
    chat.linkgc = link;
    chat.id = gid;
    chat.threeDaysLeft = false;
    chat.tenDaysLeft = false;
    chat.oneDaysLeft = false;
    chat.endDays = false;
    chat.timeOrder = `${timeWib}`;
    chat.creator = creator == 'Tidak ada'? 'Tidak ada':'wa.me/'+ creator.split('@')[1].replace(new RegExp("[()+-/ +/]", "gi"), "")
    chat.name = subject
    chat.pending = pending
  } else {
    global.db.data.chats[gid] = {
      expired: Date.now() + conn.toMs(expired),
      timeEnd : tSewaBerakhir(Date.now() + conn.toMs(expired)),
      linkgc: link,
      id: gid,
      threeDaysLeft: false,
      tenDaysLeft: false,
      oneDaysLeft: false,
      endDays: false,
      timeOrder: `${timeWib}`,
      creator: creator == 'Tidak ada'? 'Tidak ada':'wa.me/'+ creator.split('@')[1].replace(new RegExp("[()+-/ +/]", "gi"), ""),
      name: subject,
      pending: pending
    };
  }    



}



}
handler.help = ['addsewa <hari>']
handler.tags = ['owner']
handler.command = /^(setexpired|addsewa|addorder)$/i
handler.owner = true
handler.group = false

export default handler