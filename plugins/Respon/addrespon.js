let handler = async (m, { text, command }) => {
  if (!text || !text.includes('|')) {
    return m.reply(`❌ Format salah!\n\nContoh: ${command} halo|yo,hai`)
  }

  global.db.data.respon ||= {}

  let [kata, balasan] = text.split('|').map(v => v.trim())
  if (!kata || !balasan) return m.reply('⚠️ Isi tidak valid. Contoh: halo|yo,hai')

  let replies = balasan.split(',').map(v => v.trim()).filter(v => v)
  if (replies.length === 0) return m.reply('❌ Balasan kosong.')

  global.db.data.respon[kata.toLowerCase()] = replies

  m.reply(`✅ Respon untuk kata *"${kata}"* berhasil disimpan!\nBalasan: ${replies.join(', ')}`)
}

handler.help = ['addrespon <kata>|<balasan1,balasan2,...>']
handler.tags = ['tools']
handler.command = /^addrespon$/i
handler.owner = true

export default handler
