
const processedGroups = new Set()

let handler = (m) => m

handler.before = async function (m, { conn }) {
  if (!m.isGroup || m.isCommunity) return
 
  const chat = db.data.chats[m.chat]
  const id = m.groupMembers.map((item) => item.id.split("@")[0]) 
  const isOwnerHere = id.includes(global.nomerOwner)

   
  if (
    chat?.expired === 0 &&
    !isOwnerHere &&
    !processedGroups.has(m.chat)
  ) {
    processedGroups.add(m.chat)
    setTimeout(() => processedGroups.delete(m.chat), 10000)

    if (global.session === '.session' || global.session === 'sessions') return
    console.log('[ANTI-CULIK] Bot masuk grup tidak dikenal:', m.chat)

    const response = `Mohon maaf, grup ini belum terdaftar dalam database penyewaan bot kami.  
    Silakan melakukan pemesanan terlebih dahulu untuk mengaktifkan layanan bot di grup ini.  
    Hubungi kami melalui: wa.me/${global.nomerOwner}`
    
    await conn.sendMessage(m.chat, { text: response })

   

     
     const notifText = `🚨 *ANTI CULIK TERDETEKSI!*\n\nBot masuk ke grup tanpa izin!\n` +
                      `• *Grup:* ${m.groupName}\n` +
                      `• *ID:* ${m.chat}\n` +
                      `• *Pelaku:* ${(m.sender || '').split('@')[0]}\n\n` +
                      `Bot otomatis keluar dari group.`

   
    
    await conn.sendMessage(ownerBot, { text: notifText })
    await sleep(2000)
    await conn.groupLeave(m.chat)
  }
}



export default handler
