import fs from 'fs'

let timeout = 120000
let poin = 1000

// Fungsi shuffle array (Fisher-Yates)
function shuffle(array) {
  for (let i = array.length -1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

let handler = async (m, { conn, usedPrefix, command, args }) => {
  conn.game = conn.game || {}
  let id = 'tebakbendera-' + m.chat

  if (id in conn.game) {
    return conn.reply(m.chat, '❗ Masih ada soal yang belum terjawab di chat ini.', conn.game[id][0])
  }

  // Baca dan filter berdasarkan region (opsional)
  let data = JSON.parse(fs.readFileSync('./lib/game/tebakbendera.json'))
  let region = args[0] ? args[0].toLowerCase() : null
  let listRegion = [...new Set(data.map(x => x.region.toLowerCase()))]

  if (region && !listRegion.includes(region)) {
    return conn.reply(m.chat, `❌ Wilayah "${region}" tidak ditemukan.\n\nWilayah yang tersedia:\n• ${listRegion.map(x => x[0].toUpperCase() + x.slice(1)).join('\n• ')}`, m)
  }

  let filtered = region ? data.filter(x => x.region.toLowerCase() === region) : data

  // Pilih soal acak
  let soal = filtered[Math.floor(Math.random() * filtered.length)]

  // Buat pilihan jawaban: satu benar + 3 salah acak dari filtered (tidak duplikat)
  let pilihan = [soal.name]
  while (pilihan.length < 4) {
    let kandidat = filtered[Math.floor(Math.random() * filtered.length)].name
    if (!pilihan.includes(kandidat)) pilihan.push(kandidat)
  }
  // Acak pilihan jawaban
  pilihan = shuffle(pilihan)

  let caption = `
🗺️ *Wilayah:* ${soal.region}
💡 *Deskripsi:* ${soal.desc}

❓ Silakan tebak bendera di atas!
⏳ Timeout: *${(timeout / 1000).toFixed(0)} detik*
🎁 Bonus: *${poin} XP*
📝 Balas dengan jawaban yang benar!
Ketik *${usedPrefix}help ${command}* untuk bantuan.
`.trim()

  conn.game[id] = [
    await conn.sendFile(m.chat, soal.img, 'bendera.jpg', caption, m),
    soal,
    poin,
    setTimeout(() => {
      if (conn.game[id]) {
        conn.reply(m.chat, `⏰ Waktu habis!\n✅ Jawaban: *${soal.name}*`, conn.game[id][0])
        delete conn.game[id]
      }
    }, timeout)
  ]
}

handler.help = ['tebakbendera [wilayah]']
handler.tags = ['game']
handler.command = /^tebakbendera$/i
handler.onlyprem = true
handler.game = true
handler.glimit = true
handler.register = true;

export default handler
