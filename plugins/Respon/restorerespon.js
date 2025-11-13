import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

let handler = async (m, { text, command }) => {
  if (!text) return m.reply(`📌 Contoh penggunaan:\n${command} respon_backup_168xxxxxxx.json`)

  const filePath = join('./database', text.trim())
  if (!existsSync(filePath)) return m.reply(`❌ File tidak ditemukan:\n${filePath}`)

  try {
    const jsonData = readFileSync(filePath, 'utf-8')
    const data = JSON.parse(jsonData)

    if (typeof data !== 'object' || Array.isArray(data)) 
      return m.reply('❌ Format file tidak valid.')

    global.db.data.respon = data

    m.reply(`✅ Respon berhasil di-restore dari file:\n${text}`)
  } catch (e) {
    m.reply(`❌ Gagal restore data respon:\n${e.message}`)
  }
}

handler.help = ['restorerespon <nama_file.json>']
handler.tags = ['tools']
handler.command = /^restorerespon$/i
handler.owner = true

export default handler
