let handler = async (m, { text, command }) => {
  if (!text || !text.includes('|')) {
    return m.reply(`❌ Format salah!\n\nContoh: ${command} halo|yo,hai`)
  }

  global.db.data.respon ||= {}

  let [kata, balasan] = text.split('|').map(v => v.trim())
  if (!kata || !balasan) return m.reply('⚠️ Isi tidak valid. Contoh: halo|yo,hai')

  let key = kata.toLowerCase()
  let newReplies = balasan.split(',').map(v => v.trim()).filter(v => v)

  if (newReplies.length === 0) return m.reply('❌ Balasan kosong.')

  // Inisialisasi jika belum ada
  if (!Array.isArray(global.db.data.respon[key])) global.db.data.respon[key] = []

  let existingReplies = global.db.data.respon[key]

  // Filter balasan yang belum ada
  let uniqueReplies = newReplies.filter(r => !existingReplies.includes(r))

  if (uniqueReplies.length === 0) {
    return m.reply(`⚠️ Semua balasan sudah pernah ditambahkan untuk kata *"${kata}"*!`)
  }

  // Tambahkan hanya yang unik
  global.db.data.respon[key].push(...uniqueReplies)

  m.reply(`✅ Berhasil menambahkan balasan baru untuk *"${kata}"*:\n➤ ${uniqueReplies.join(', ')}`)
}

handler.help = ['addrespon <kata>|<balasan1,balasan2,...>']
handler.tags = ['tools']
handler.command = /^train$/i
handler.owner = true

export default handler
