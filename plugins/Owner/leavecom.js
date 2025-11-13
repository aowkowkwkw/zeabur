 

let handler = async (m, { conn, args, isOwner, usedPrefix, command }) => {
  if (!isOwner) return m.reply('Fitur ini khusus untuk owner bot!')

  try {
    const allGroups = Object.keys(conn.chats).filter(v => v.endsWith('@g.us'))
    const communities = []

    for (const id of allGroups) {
      const metadata = await conn.groupMetadata(id).catch(() => null)
      if (metadata?.community) communities.push(id)
    }

    if (!communities.length) return m.reply('Bot tidak tergabung dalam komunitas manapun.')

    if (args[0]) {
      const target = args[0].trim()
      if (!target.endsWith('@g.us')) return m.reply(`❌ Format ID salah!\nContoh:\n${usedPrefix + command} 1203630xxxxx-xxxxx@g.us`)
      if (!communities.includes(target)) return m.reply('❌ Bot tidak tergabung dalam komunitas tersebut.')

      await conn.groupLeave(target)
      return m.reply(`✅ Berhasil keluar dari komunitas:\n${target}`)
    } else {
      for (const id of communities) {
        await conn.groupLeave(id)
        await sleep(1500)
      }
      return m.reply(`✅ Berhasil keluar dari semua komunitas (${communities.length} total).`)
    }
  } catch (e) {
    console.error(e)
    return m.reply('❌ Terjadi kesalahan saat keluar dari komunitas.')
  }
}

handler.command = ['leavecom', 'leavecommunity', 'outcom']
handler.owner = true
handler.tags = ['owner']
handler.help = ['leavecom [id_grup]', 'leavecom']
// command tanpa arg keluar semua komunitas, kalau ada arg -> keluar dari yang dituju

export default handler;