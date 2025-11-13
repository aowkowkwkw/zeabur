let handler = m => m

handler.before = async function (m, { conn }) {
  const id = m.chat
  conn.math = conn.math || {}

  if (id in conn.math) {
    const math = conn.math[id][1]
    const answer = parseFloat(m.text.trim())

    // Validasi input angka
    if (!/^-?\d+(\.\d+)?$/.test(m.text)) return

    // Cek jawaban dengan toleransi desimal
    if (Math.abs(answer - math.result) < 1e-2) {
      db.data.users[m.sender].exp += math.bonus
      clearTimeout(conn.math[id][3])
      delete conn.math[id]
      return m.reply(`✅ *Benar!*\n🎉 +${math.bonus} XP`)
    } else {
      return m.reply('❌ Salah! Coba lagi.')
    }
  }
}

export default handler
