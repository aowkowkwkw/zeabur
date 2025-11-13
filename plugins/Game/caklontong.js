import fs from 'fs'
let timeout = 120000
let poin = 1000
let handler = async (m, { conn, usedPrefix }) => {
    conn.game = conn.game ? conn.game : {}
    let id = 'caklontong-' + m.chat
    if (id in conn.game) return conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.game[id][0])
    let src = JSON.parse(fs.readFileSync('./lib/game/caklontong.json', 'utf-8'))
    let json = src[Math.floor(Math.random() * src.length)]
    let caption = `
${json.soal}

Timeout *${(timeout / 1000).toFixed(2)} detik*
Ketik ${usedPrefix}calo untuk bantuan
Bonus: ${poin} XP
`.trim()
    conn.game[id] = [
        await conn.reply(m.chat, caption, m),
        json, poin,
        setTimeout(async () => {
            if (conn.game[id]) await conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*\n${json.deskripsi}`, conn.game[id][0])
            delete conn.game[id]
        }, timeout)
    ]
}
handler.help = ['caklontong']
handler.tags = ['game']
handler.command = /^caklontong/i
handler.onlyprem = true
handler.game = true
handler.glimit = true
handler.register = true;


export default handler