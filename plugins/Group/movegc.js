 

function getAdmins(participants = []) {
  return participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin');
}

let handler = async (m, { prefix, command, q, setReply, isOwner }) => {
  if (m.isGroup && !m.isAdmin && !isOwner) return setReply('Hanya admin dan owner yang bisa pakai perintah ini.')
  if (!q && m.isGroup) throw 'Masukkan link grup yang ingin dipindahkan.'
  if (!q && !m.isGroup) throw `Untuk memindahkan bot dari private chat, ketik: ${prefix + command} idgc|linkgc`
  if (!m.isGroup && !q.includes("|")) return setReply(`Format salah!\nKetik ${prefix + command} idGc|linkgc`)

  let idGc = m.isGroup ? m.chat : q.split("|")[0]
  let linkGc = m.isGroup ? q : q.split("|")[1]
  let chat = db.data.chats[idGc]
  if (!chat) throw 'ID grup tidak ditemukan di database bot.'
  if (chat && chat.expired === 0) throw `Grup dengan ID: ${idGc} tidak memiliki waktu order.`

  let rex1 = /chat.whatsapp.com\/([\w\d]*)/g
  let code = m.isGroup ? q.match(rex1) : q.split("|")[1].match(rex1)
  if (code == null) return setReply("Tidak ada URL undangan yang terdeteksi.")
  let kode = code[0].replace("chat.whatsapp.com/", "")
  let { id, subject, creation, desc, descId, participants, owner, subjectOwner } = await conn.groupGetInviteInfo(kode).catch(async () => {
    return setReply("URL undangan tidak valid.")
  })

  let tagnya = owner == undefined ? (subjectOwner == undefined ? "" : subjectOwner) : owner
  let creator = `${owner == undefined ? (subjectOwner == undefined ? "Tidak ada" : "wa.me/" + subjectOwner.split("@")[0]) : "wa.me/" + owner.split("@")[0]}`

  let newChat = db.data.chats[id]

  if (newChat) {
    newChat.timeEnd = chat.timeEnd
    newChat.linkgc = linkGc
    newChat.id = id
    newChat.expired = chat.expired
    newChat.threeDaysLeft = chat.expired.threeDaysLeft
    newChat.tenDaysLeft = chat.expired.tenDaysLeft
    newChat.oneDaysLeft = chat.expired.oneDaysLeft
    newChat.endDays = chat.expired.endDays
    newChat.timeOrder = chat.timeOrder
    newChat.creator = creator
    newChat.name = subject
  } else {
    db.data.chats[id] = {
      name: subject,
      id: id,
      opened: chat.opened,
      closed: chat.closed,
      tenDays: chat.tenDays,
      treeDays: chat.treeDays,
      oneDays: chat.oneDays,
      linkgc: linkGc,
      expired: chat.expired,
      tenDaysLeft: chat.tenDaysLeft,
      treeDaysLeft: chat.treeDaysLeft,
      oneDaysLeft: chat.oneDaysLeft,
      threeDaysLeft: chat.threeDaysLeft,
      timeOrder: chat.timeOrder,
      creator: creator,
      timeEnd: chat.timeEnd,
      endDays: chat.endDays
    }
  }

  let cekid = conn.ms(chat.expired - Date.now())

  let contextInfo = {
    forwardingScore: 50,
    isForwarded: true,
    mentionedJid: [tagnya],
    externalAdReply: {
      showAdAttribution: false,
      title: fake,
      body: baileysVersion,
      mediaType: 1,
      sourceUrl: "https://wa.me/c/6285953938243",
      thumbnailUrl: 'https://telegra.ph/file/0aa9d587a19e37a0b0122.jpg'
    }
  }

  let nana
  try {
    nana = await conn.groupAcceptInvite(kode)
  } catch {
    nana = undefined
  }

  let groupMetadata = nana == undefined ? {} : await conn.groupMetadata(id)
  let data = nana == undefined ? participants : groupMetadata.participants
  let member = data.filter(u => u.admin !== 'admin' && u.admin !== 'superadmin')
  let admin = getAdmins(data)

  let text = `
––––––『 MOVE GROUP SUCCESS 』––––––
🔰 Group: ↓
• Name: ${subject}
• Created at: ${new Date(creation * 1000).toLocaleString()}
• Creator: ${creator}
• Group Id: ${id}
• Admins: ${admin.length}
• Members: ${member.length}
• Days: ${cekid.days} Hari, ${cekid.hours} Jam, ${cekid.minutes} Menit
• Countdown: ${chat.expired - Date.now()}
• Time order: ${chat.timeOrder}
• Time end: ${chat.timeEnd}
•·–––––––––––––––––––––––––·•

📮 Note: ↓
• Ketik ${prefix}menu untuk mengakses bot
• Ketik ${prefix}ceksewa untuk melihat sisa sewa
• Lapor ke owner jika bot tidak berfungsi
• Owner wa.me/${nomerOwner}

${copyright} - ${calender}
`

  await conn.sendMessage(m.chat, { text, contextInfo, mentions: [tagnya] })
  if (nana == undefined) return m.reply('Menunggu persetujuan untuk bergabung ke grup baru.')
  await sleep(3000)
  await conn.sendMessage(id, { text, contextInfo, mentions: [tagnya] })

  // 🔔 Kirim notifikasi ke admin grup lama & baru
  try {
    let metadataLama = await conn.groupMetadata(idGc)
    let adminLama = getAdmins(metadataLama.participants)

    for (let adm of adminLama) {
      await conn.sendMessage(adm.id, {
        text: `📢 *Pemberitahuan*\nBot telah dipindahkan dari grup *${metadataLama.subject}* ke grup baru *${subject}*\n\nHubungi owner jika perlu bantuan: wa.me/${nomerOwner}`,
      })
    }

    for (let adm of admin) {
      await conn.sendMessage(adm.id, {
        text: `📢 *Pemberitahuan*\nBot telah bergabung ke grup *${subject}* menggantikan grup lama *${metadataLama.subject}*\n\nSilakan akses bot dengan perintah: ${prefix}menu`,
      })
    }
  } catch (e) {
    console.log("❌ Gagal kirim notifikasi admin:", e)
  }

  await conn.groupLeave(idGc)
  delete db.data.chats[idGc]
}

handler.command = ['movegc', 'moveongc', 'pindah', 'pindahbot']
handler.tags = ['internet']
handler.group = true

export default handler
