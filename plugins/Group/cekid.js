let handler = async (m, {conn }) => {
conn.reply(m.chat, `${await m.groupMetadata.id}`, m)
}
handler.help = ['cekid']
handler.tags = ['group']
handler.command = /^(cekid|idgc|gcid)$/i

handler.group = true

export default handler  