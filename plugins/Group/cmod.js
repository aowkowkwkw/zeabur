let handler = async (m, {conn, q }) => {
  if (!m.quoted) return m.reply('❌ Balas pesan yang ingin dimodifikasi.')
 // Gunakan pesan asli mentah (raw message)
    const quotedMsg = m.quoted.fakeObj || m.quoted.msg
    if (!quotedMsg) return m.reply('❌ Tidak dapat membaca pesan yang dibalas.')
    // Pastikan teks diisi
    const content = q || '✅ Ini adalah pesan hasil modifikasi.'

    try {
      const modified = await conn.cMod(m.chat, m.quoted, content, m.sender)
      await conn.relayMessage(m.chat, modified.message, { messageId: modified.key.id })
    } catch (e) {
      m.reply('❌ Gagal memodifikasi pesan.')
      console.error(e)
    }
}
handler.help = ['cekid']
handler.tags = ['group']
handler.command = /^(cmod)$/i

handler.group = true

export default handler  