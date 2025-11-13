import { ensureClassifier } from '../../lib/classifier.js'

let handler = async (m, { text, command }) => {
  if (!text) return m.reply(`📌 Contoh penggunaan:\n${command} on/off`)

  const input = text.toLowerCase()
  if (!['on','off'].includes(input)) {
    return m.reply(`📌 Contoh penggunaan:\n${command} on/off`)
  }

  if (input === 'on') {
    if(global.classifier) return m.reply('Smart respon sudah aktif')
    await ensureClassifier()
    m.reply('Smart respon telah diaktifkan')
  } else if (input === 'off') {
    if (!global.classifier) return m.reply('Smart respon sudah nonaktif')
    delete global.classifier
    m.reply('Smart respon telah dinonaktifkan')
  }
}

handler.command = /^smartrespon$/i
handler.owner = true

export default handler
