
const handler = async (m, { q }) => {
  if(m.quoted) return m.reply('Jangan reply pesan')
if(!q) return m.reply('Masukan jawaban kamu')

  global.__ajarRespon ||= {}
  const pertanyaan = global.__ajarRespon[m.sender]?.text

  if (!pertanyaan) {
    return m.reply('Kamu belum nanya apa-apa ke aku 😔\nCoba ketik sesuatu dulu, nanti aku ajarin jawabannya lewat `.ajar jawaban`')
  }

  const jawaban = q?.trim()
  if (!jawaban) {
    return m.reply('❗Contoh penggunaan:\n.ajar Aku bot unyu buatan Dittaz!')
  }

  // Tambahkan ke database respon
  if (!global.db.data.respon[pertanyaan]) {
    global.db.data.respon[pertanyaan] = []
  }
  global.db.data.respon[pertanyaan].push(jawaban)

  // Hapus sesi ajar
  delete global.__ajarRespon[m.sender]

  m.reply(`✅ Sip! Aku udah hafal jawaban buat:\n🗣️ "${pertanyaan}"\n💬 "${jawaban}"`)
}

handler.command = /^ajar$/i
export default handler
