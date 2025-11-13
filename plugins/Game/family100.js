import fs from 'fs'
const winScore = 1000
let timeout = 240000
async function handler(m,{conn,command,usedPrefix}) {
    conn.game = conn.game ? conn.game : {}
    let id = 'family100-' + m.chat
    if (id in conn.game) return conn.reply(m.chat, 'Masih ada kuis yang belum terjawab di chat ini', conn.game[id][0])
    let src = JSON.parse(fs.readFileSync('./lib/game/family100.json', 'utf-8'))
    let json = src[Math.floor(Math.random() * src.length)]
    let caption = `
*Soal:* ${json.soal}

Terdapat *${json.jawaban.length}* jawaban${json.jawaban.find(v => v.includes(' ')) ? `
(beberapa jawaban terdapat spasi)
`: ''}
+${winScore} EXP tiap jawaban benar

Timeout *${(timeout / 1000).toFixed(2)} detik*
Ketik ${usedPrefix}help ${command} untuk bantuan
    `.trim()

        conn.game[id] = [
        await m.reply(caption),
        json, 
        winScore,
        Array.from(json.jawaban, () => false),
        setTimeout(async () => {
            if (conn.game[id]) await conn.reply(m.chat, `Waktu habis`, conn.game[id][0])
            delete conn.game[id]
        }, timeout)
    ]


}
handler.help = ['family100']
handler.tags = ['game']
handler.command = /^family100$/i
handler.onlyprem = true
handler.game = true
handler.glimit = true
handler.register = true;

export default handler