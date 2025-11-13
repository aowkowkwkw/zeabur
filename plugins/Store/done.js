 

import moment from '../../modules/moment.js'
let handler = async (m, { conn,q }) => {
const chat = db.data.chats[m.chat];
if(!m.isGroup) throw 'Group only'
if (m.isGroup && !q ) throw 'tag user'  
  let wib = moment.tz('Asia/Jakarta').format('HH:mm:ss')
  //    let ucpn = `${ucapan()}`
    let d = new Date(new Date + 3600000)
    let locale = 'id'
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
    let date = d.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
    // d.getTimeZoneOffset()
    // Offset -420 is 18.00
    // Offset    0 is  0.00
    // Offset  420 is  7.00

  const numberQuery = q.replace(new RegExp("[()+-/ +/]", "gi"), "") + `@s.whatsapp.net`
  let Input = m.isGroup? m.mentionByTag[0]? m.mentionByTag[0] : m.mentionByReply ? m.mentionByReply : q? numberQuery : false : false
 
    let pesanan = m.mentionByReply ? q : ''
let skyline = `*TRANSAKSI SUKSES*

☍ Jam : ${wib} 
☍ Tanggal : ${date}
☍ Status : Sukses
☍ ID Buyer : ${Input.replace('@s.whatsapp.net', '').replace(/[\(\)\-\+ ]/g, '')}

Transaksi @${Input.split("@")[0]} sukses dilakukan, terima kasih telah
membeli produk kami >.<`

let text = (chat.sDone !== ''? chat.sDone : skyline)
.replace("@user", Input.replace('@s.whatsapp.net', ''))
.replace("@jam", timeZone)
.replace("@tanggal", date )
.replace("@group", m.groupName)
.replace("@pesanan", pesanan);




conn.sendMessage(m.chat, {
text,
mentions:[Input],
contextInfo: {
  mentionedJid:[Input],
  /*
externalAdReply: {
title: `${fake} Store`,
body: "Success Message",
thumbnailUrl: "https://telegra.ph/file/1f53aa89c1cadb021247b.jpg",
sourceUrl: "",
mediaType: 1,
renderLargerThumbnail: true
}
*/

}})
}
handler.help = ['done *@user*']
handler.tags = ['store']
handler.command = ['done','d']
export default handler