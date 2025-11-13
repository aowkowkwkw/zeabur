const threshold = 0.72

export async function before(m, { conn, prefix }) {
  let p = m.quoted ? m.quoted :  m 
  let mime = (p.msg || p).mimetype || '';
  let isMedia = /image|video|audio/.test(mime)

  conn.game = conn.game || {}
  const isCmd = m.body.startsWith(prefix)
  const types = [
    'tebakbendera',
    'tebakgambar',
     'tebakgame', 
     'susunkata', 
     'caklontong', 
     'siapakahaku', 
     'tebaklagu', 
     'lengkapikalimat', 
     'tebakkata', 
     'tebaklirik', 
     'tebaktebakan', 
     'asahotak'
    ]

  // === GAME FAMILY 100 ===
  const idF100 = 'family100-' + m.chat
  if (idF100 in conn.game) {
    const room = conn.game[idF100]
    const gameData = room[1]
    const jawabanList = gameData.jawaban.map(j => j.toLowerCase())
    const soal = gameData.soal
    const winScore = room[2]
    const terjawab = room[3]
    const text = m.text.toLowerCase().replace(/[^\w\s\-]+/g, '')
    const isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.text)

    if (!isSurrender) {
      let index = jawabanList.indexOf(text)
      if (index < 0) {
        const closest = Math.max(...jawabanList.map((j, i) => terjawab[i] ? 0 : similarity(j, text)))
        if (closest >= threshold) m.reply('💡 Dikit lagi! Jawabanmu hampir benar.')
        return !0
      }

      if (terjawab[index]) return !0
      const users = global.db.data.users[m.sender]
      terjawab[index] = m.sender
      users.exp += winScore
    }

    const isWin = terjawab.every(Boolean)

    const caption = `
📢 *Soal:* ${soal}
🧠 Terdapat *${jawabanList.length}* jawaban${jawabanList.some(v => v.includes(' ')) ? ` (beberapa jawaban terdiri dari lebih dari satu kata)` : ''}

${isWin ? '🎉 *SEMUA JAWABAN TERJAWAB!*' : isSurrender ? '😔 *MENYERAH!*' : ''}

${jawabanList.map((j, i) => {
  return terjawab[i] ? `(${i + 1}) ${j} ✅ @${terjawab[i].split('@')[0]}` : null
}).filter(Boolean).join('\n')}

${isSurrender ? '' : `🎁 +${winScore} XP untuk setiap jawaban benar!`}
${isWin ? '\n\n🎮 *Game telah berakhir!* Terima kasih sudah bermain.' : ''}
`.trim()

    const msg = await conn.reply(m.chat, caption, null, {
      mentions: conn.parseMention(caption)
    })
    room.msg = msg

    if (isWin || isSurrender) delete conn.game[idF100]
    return !0
  }

  // === GAME UMUM LAINNYA ===
  let id = types.map(type => `${type}-${m.chat}`).find(id => conn.game[id])
  if (!id || !conn.game[id]) return

  const isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.text)
  if (isSurrender) {
    clearTimeout(conn.game[id][3])
    delete conn.game[id]
    return m.reply('Yah Menyerah :( ')
  }

  const teksBenar = [
    `🔥 Wih mantap! Jawaban kamu *benar*!\n+${conn.game[id][2]} EXP mendarat ke profil kamu 🚀`,
    `✅ Betul banget bosku!\nKamu dapet bonus *+${conn.game[id][2]} EXP* 💰`,
    `🎯 Jawaban kamu *pas banget!*\nLangsung dapet +${conn.game[id][2]} EXP 😎`,
    `🧠 Otak encer nih! Bener!\nKamu diganjar +${conn.game[id][2]} EXP 💡`,
    `🎉 Yeeay! Jawaban kamu *tepat sasaran!*\nEXP bertambah +${conn.game[id][2]} 🎊`
  ]
  // Array variasi respon jawaban salah
const wrongAnswers = shuffleArray([
  '❌ Salah!',
  '😅 Belum benar!',
  '🤔 Coba lagi!',
  '🙈 Masih salah!',
  '😬 Bukan itu!',
  '💀 Wah, meleset!',
  '😓 Sayang sekali, coba lagi ya!',
  '📛 Jawabanmu belum tepat!'
])

// Pilih satu respon secara acak
let randomWrong = wrongAnswers[0]
  const json = conn.game[id][1]
  const jawaban = (json?.jawaban || json?.name || json?.judul).toLowerCase().trim()
  const masukan = m.text.toLowerCase().trim()
  const isCaklontong = id.startsWith('caklontong-')
  const hint = jawaban.length
  const adding = isCaklontong ? '\n\n' + json.deskripsi : ''

  if (masukan === jawaban || masukan.includes(jawaban)) {
    global.db.data.users[m.sender].exp += conn.game[id][2]
    m.reply(teksBenar[Math.floor(Math.random() * teksBenar.length)] + adding)
    clearTimeout(conn.game[id][3])
    delete conn.game[id]
  } else if (similarity(masukan, jawaban) >= threshold) {
    m.reply(`💡 Dikit lagi!`)
  } else if (masukan.length < hint && !isCmd && !isMedia) {
    m.reply(randomWrong)
  }

  return !0
}

 




function shuffleArray(arr) {
  let a = arr.slice() // Bikin copy biar array aslinya gak rusak
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
