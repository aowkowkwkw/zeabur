let handler = async (m, { text, command }) => {
  if (!text) return m.reply(`📌 Contoh penggunaan:\n${command} halo`)

  global.db.data.respon ||= {}

  let respon = global.db.data.respon[text.toLowerCase()]
  if (!respon) return m.reply(`❌ Tidak ditemukan respon untuk kata: *${text}*`)

  let random = respon[Math.floor(Math.random() * respon.length)]
  m.reply(`💬 Respon untuk *"${text}"*:\n${random}`)
}

handler.help = ['respon <kata>']
handler.tags = ['tools']
handler.command = /^respon$/i
handler.owner = true

export default handler
