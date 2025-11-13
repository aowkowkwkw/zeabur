const handler = async (m, { conn, args, usedPrefix, command }) => {
  conn.math = conn.math || {}

  const modes = {
    noob: [-3, 3, -3, 3, '+-', 15000, 10],
    easy: [-10, 10, -10, 10, '*/+-', 20000, 40],
    medium: [-40, 40, -20, 20, '*/+-', 40000, 150],
    hard: [-100, 100, -70, 70, '*/+-', 60000, 350],
    extreme: [-999999, 999999, -999999, 999999, '*/', 99999, 9999],
    impossible: [-99999999999, 99999999999, -99999999999, 999999999999, '*/', 30000, 35000],
    impossible2: [-999999999999999, 999999999999999, -999, 999, '/', 30000, 50000]
  }

  if (!args[0]) {
    return m.reply(`Mode tersedia:\n${Object.keys(modes).join(' | ')}\n\nContoh: ${usedPrefix}${command} medium`)
  }

  const mode = args[0].toLowerCase()
  if (!(mode in modes)) {
    return m.reply(`Mode tidak dikenal!\nPilih salah satu dari: ${Object.keys(modes).join(' | ')}`)
  }

  const id = m.chat
  if (conn.math[id]) return m.reply('❗ Masih ada soal yang belum dijawab di chat ini!')

  const math = genMath(mode, modes)
  conn.math[id] = [
    await m.reply(`📊 *Soal Matematika*\nBerapa hasil dari: *${math.str}*?\n\n⏱ Timeout: ${(math.time / 1000).toFixed(1)} detik\n🎁 Bonus: ${math.bonus} XP`),
    math, 4,
    setTimeout(() => {
      if (conn.math[id]) {
        m.reply(`⏰ *Waktu habis!*\nJawabannya: *${math.result}*`)
        delete conn.math[id]
      }
    }, math.time)
  ]
}

handler.help = ['math <mode>']
handler.tags = ['game']
handler.command = /^math$/i
handler.glimit = true
handler.register = true;

export default handler

// --- Fungsi Pendukung ---
function genMath(mode, modes) {
  const [a1, a2, b1, b2, ops, time, bonus] = modes[mode]
  let a, b, op, result

  do {
    a = randomInt(a1, a2)
    b = randomInt(b1, b2)
    op = pickRandom(ops.split(''))
    result = calc(a, b, op)
  } while (!Number.isFinite(result) || isNaN(result))

  const str = `${a} ${operators[op]} ${b}`
  return { str, time, bonus, mode, result: Math.round(result * 100) / 100 }
}

function calc(a, b, op) {
  switch (op) {
    case '+': return a + b
    case '-': return a - b
    case '*': return a * b
    case '/': return b === 0 ? NaN : a / b
  }
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

const operators = {
  '+': '+',
  '-': '-',
  '*': '×',
  '/': '÷'
}
