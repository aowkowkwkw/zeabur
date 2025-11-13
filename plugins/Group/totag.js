
let handler = async (m, { conn}) => {
	
    let users = m.groupMembers.map(v => v.id).filter(v => v !== conn.user.jid).slice(0, 100); // ⛔️ Max 100 tag
    if (!m.quoted) throw `✳️ Reply Pesan`
    conn.sendMessage(m.chat, { forward: m.quoted.fakeObj, mentions: users } )
}

handler.help = ['totag']
handler.tags = ['group']
handler.command = /^(totag|tag)$/i

handler.admin = true
handler.group = true

export default handler
