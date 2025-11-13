import {hitungUmur} from "../../lib/myfunc.js"

let handler = async (m, { conn, text, setReply, command }) => {
 
  let teks = `
––––––『 *OWNER BOT* 』––––––
⭔ *Nama* : ${ownerName}
⭔ *Nomor* : wa.me/${nomerOwner}
⭔ *Gender* : ${global.gender}
⭔ *Agama* : ${global.agama}
⭔ *Tanggal lahir* : ${global.tanggalLahir}
⭔ *Umur* : ${hitungUmur(global.tanggalLahir)} tahun
⭔ *Hobby* : ${global.hobi}
⭔ *Sifat* : ${global.sifat}
⭔ *Tinggal* : ${global.tempatTinggal}
⭔ *Waifu* : ${global.waifu}
•·–––––––––––––––––––––––––·•

📮 *Note:* ↓
• Owner berhak blockir tanpa alasan
• Nanya yang sopan ya, 
  jangan nanya yang aneh"
• Chat yang nyambung sama BOT, 
  bukan nyambung ke hati
• Owner Hanya merespon yang 
  berkaitan dengan BOT
• No Call kalau nggak penting. 
  kecuali deptcollector
•·–––––––––––––––––––––––––·•
        
`;
  let teks2 = `${copyright} - ${calender}`;
  if(global.ownerPhoto == undefined || global.ownerPhoto == '' ) return setReply(teks + teks2);
 setReply2(teks + teks2);




//SetReply
async function setReply2(teks,member = []){
  let photo = global.ownerPhoto
  let contextInfo = {
  forwardingScore: 1,
  isForwarded: true,
  mentionedJid:member,
  forwardedNewsletterMessageInfo: {
  newsletterJid,
  serverMessageId: 100,
  newsletterName
  },
  externalAdReply:{
  showAdAttribution: false,
  title: `${transformText(baileysVersion)}`,
  body:`No Runtime`,
  sourceUrl:global.myUrl,
  mediaType: 1,
  renderLargerThumbnail : false,
  thumbnailUrl: photo,  
  }
  }
  conn.sendMessage(m.chat, { contextInfo,mentions: member, text:` ${member.length > 0 ? teks: /(http|wa\.me)/.test(teks)? teks : transformText(teks)}` }, { quoted: m })
  }


};
handler.help = ["no"]
handler.tags = ["info"];
handler.command = ["owner"];
export default handler;
