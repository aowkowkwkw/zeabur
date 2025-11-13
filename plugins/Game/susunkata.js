import fs from 'fs'
let timeout = 120000
let poin = 1000
let handler = async (m, { conn, command, usedPrefix }) => {
    conn.game = conn.game ? conn.game : {}
    let id = 'susunkata-' + m.chat
    if (id in conn.game) return conn.reply(m.chat, 'Masih ada pertanyaan belum terjawab di chat ini', conn.game[id][0])
    let src = JSON.parse(fs.readFileSync('./lib/game/susunkata.json', 'utf-8'))
    let json = src[Math.floor(Math.random() * src.length)]
    let caption = `
${json.soal}

Tipe: ${json.tipe}

Timeout *${(timeout / 1000).toFixed(2)} detik*
Ketik ${usedPrefix}help ${command} untuk bantuan
Bonus: ${poin} EXP
`.trim()
    conn.game[id] = [
        await m.reply(caption),
        json, 
        poin,
        setTimeout(() => {
            if (conn.game[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.game[id][0])
            delete conn.game[id]
        }, timeout)
    ]
}
handler.help = ['asahotak']
handler.tags = ['game']
handler.command = /^susunkata$/i
handler.game = true
handler.glimit = true
handler.register = true;

export default handler