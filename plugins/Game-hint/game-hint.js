// 1 asahotak
// 2 caklontong = ada desc
// 3 lengkapikalimat
// 4 siapakahaku
// 5 susunkata = ada tipe
// 6 tebakkata
// 7 tebaklirik
// 8 tebaktebakan


let handler = async (m, { conn, q }) => {
  conn.game = conn.game || {};
  if (!q) return m.reply('🎮 Masukkan *nama game* yang ingin kamu bantu!\nContoh: *.help tebakgambar*');

  let id = `${q}-${m.chat}`;
  if (!conn.game[id]) return m.reply(`🚫 Game *${q}* belum dimulai!\n\nKetik *.${q}* untuk memulai.`);

  let json = conn.game[id][1];
  let data = json?.jawaban || json?.judul || json?.name
 
  // Tangani jika jawaban adalah array atau string
  let clues = Array.isArray(data)
    ? data.map(generateHint)
    : [generateHint(data)];

  let hintMessage = clues.map((clue, i) => `🔹 ${clue}`).join('\n');

  m.reply(
    `💡 *Clue* untuk game *${q.toUpperCase()}*:\n\n\`\`\`\n${hintMessage}\n\`\`\`\n` +
    `📌 *Hint:* Terdiri dari ${Array.isArray(data) ? `${data.length} kata/jawaban` : `${data.length} karakter`}.\n` +
    `❗ _Jangan balas chat ini, tapi balas soal yang dikirim sebelumnya!_`
  );
};

handler.command = /^help$/i;
handler.glimit = true;
export default handler;

function generateHint(jawaban) {
  return jawaban
    .split(' ')
    .map(kata => {
      if (kata.length <= 2) return kata.split('').join(' '); // tetap kasih spasi antar huruf
      return kata
        .split('')
        .map((char, i) => {
          if (i === 0 || i === kata.length - 1) return char;
          return /[a-zA-Z]/.test(char) ? '_' : char;
        })
        .join(' '); // tambahkan spasi antar huruf
    })
    .join('   '); // beri spasi lebar antar kata
}




