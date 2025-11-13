 

const handler = async (m, { conn, args, usedPrefix, command }) => {
    if(m.isGroup && !m.mention && m.numberQuery == '') return m.reply('Reply/Tag/Input nomer')
    if(!m.isGroup && m.numberQuery == '') return m.reply('Input nomer telepon')  
  let target = m.isGroup? m.mention || m.numberQuery : m.numberQuery


  try {
    const profile = await conn.getBusinessProfile(target)
    if (!profile || Object.keys(profile).length === 0) {
      return m.reply('❌ Nomor tersebut bukan akun bisnis atau tidak memiliki profil bisnis.')
    }

    // Ambil foto profil bisnis
    const pp = await conn.profilePictureUrl(target, 'image').catch(_ => 'https://i.ibb.co/MBLKQ6H/business-default.png')

    // Format teks profil bisnis
    let caption = `🧾 *Profil Bisnis WhatsApp*\n\n`
    caption += `📇 *JID:* ${profile.jid}\n`
    if (profile.description) caption += `📝 *Deskripsi:* ${profile.description}\n`
    if (profile.address) caption += `📍 *Alamat:* ${profile.address}\n`
    if (profile.website) caption += `🌐 *Website:* ${profile.website}\n`
    if (profile.email) caption += `📧 *Email:* ${profile.email}\n`
    if (profile.category) caption += `🏷️ *Kategori:* ${profile.category}\n`

    await conn.sendFile(m.chat, pp, 'profile.jpg', caption.trim(), m)
  } catch (e) {
    console.error(e)
    m.reply('⚠️ Gagal mengambil profil bisnis. Pastikan nomor valid dan merupakan akun bisnis.')
  }
}

handler.help = ['bizprofile [@user]', 'cekbisnis [@user]']
handler.tags = ['tools']
handler.command = ['bizprofile', 'cekbisnis']
handler.group = false
handler.premium = false

export default handler