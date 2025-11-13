import { writeFileSync } from 'fs'
import { join } from 'path'

let handler = async (m, { command }) => {
  global.db.data.respon ||= {}

  const data = global.db.data.respon
  if (Object.keys(data).length === 0) return m.reply('📭 Tidak ada data respon untuk dibackup.')

  try {
    const filePath = join('./database', `respon_backup_${Date.now()}.json`)
    writeFileSync(filePath, JSON.stringify(data, null, 2))

    m.reply(`✅ Backup respon berhasil disimpan di:\n${filePath}`)
  } catch (e) {
    m.reply(`❌ Gagal backup data respon:\n${e.message}`)
  }
}

handler.help = ['backuprespon']
handler.tags = ['tools']
handler.command = /^backuprespon$/i
handler.owner = true

export default handler
