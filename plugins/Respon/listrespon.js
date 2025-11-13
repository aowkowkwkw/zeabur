let handler = async (m, { command }) => {
  global.db.data.respon ||= {}

  let keys = Object.keys(global.db.data.respon)
  if (keys.length === 0) return m.reply('📭 Belum ada data respon yang tersimpan.')

  let teks = `📋 *Respon Tersimpan:*\n\n`
  for (let key of keys) {
    let val = global.db.data.respon[key]
    teks += `💬 *${key}*\n`
    for (let isi of val) {
      teks += ` - ${isi}\n`
    }
    teks += `\n`
  }

  teks += `🔥 Total trigger: ${keys.length}`

  m.reply(teks.trim())
}

handler.help = ['listrespon']
handler.tags = ['tools']
handler.command = /^listrespon$/i
handler.owner = true

export default handler
