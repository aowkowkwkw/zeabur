let handler = async (m, { text, command }) => {
  if (!text) return m.reply(`📌 Contoh penggunaan:\n${command} halo`)

  global.db.data.respon ||= {}

  let kata = text.toLowerCase()
  if (!(kata in global.db.data.respon)) {
    return m.reply(`❌ Tidak ada respon yang tersimpan untuk kata: *${kata}*`)
  }

  delete global.db.data.respon[kata]
  m.reply(`✅ Respon untuk kata *"${kata}"* berhasil dihapus.`)
}

handler.help = ['delrespon <kata>']
handler.tags = ['tools']
handler.command = /^delrespon$/i
handler.owner = true

export default handler
