//Optimized by ChatGPT

 
import moment from '../../modules/moment.js'

let handler = async (m, { conn, usedPrefix, command, isOwner, q, setReply }) => {
  let timeWib = moment().tz('Asia/Jakarta').format('DD/MM/YYYY HH:mm');
  let { isGroup, mentionByReply, mentionByTag, botNumber } = m;

  // Hanya owner yang bisa akses perintah ini
  if (!isOwner) return setReply(mess.only.ownerB);

  // Proses untuk mention user dalam grup
  let nomernya, waktunya, namanye;
  if (isGroup && mentionByReply) {
    nomernya = mentionByReply;
    waktunya = q;
    namanye = await conn.getName(mentionByReply);
  } else if (isGroup && mentionByTag) {
    nomernya = mentionByTag[0];
    waktunya = q.split(" |")[1] || q.split("| ")[1] || q.split(" ")[1];
    namanye = await conn.getName(mentionByTag[0]);
  } else if ((isGroup || !isGroup) && q.startsWith("+")) {
    nomernya = q.split("|")[0].replace(/[()+-/\s]/g, "") + "@s.whatsapp.net";
    waktunya = q.split("|")[1];
    namanye = await conn.getName(nomernya);
  } else {
    return setReply("Penggunaan salah, silakan reply/tag/input nomor +");
  }

  // Pastikan waktu terisi
  if (!waktunya) return setReply("Masukan waktu dalam format s/d/h/d (detik/jam/hari)");

  let user = db.data.users[nomernya];

  // Update data pengguna dengan masa premium
  if (user) {
    user.name = namanye;
    user.premium = true;
    user.premiumTime = Date.now() + conn.toMs(waktunya);
    user.timeOrder = timeWib;
    user.timeEnd = moment(Date.now() + conn.toMs(waktunya)).tz('Asia/Jakarta').format('DD/MM/YYYY HH:mm');
    user.reminded = false; // Reset reminded jika diperpanjang
  } else {
    db.data.users[nomernya] = {
      name: namanye,
      premium: true,
      premiumTime: Date.now() + conn.toMs(waktunya),
      timeOrder: timeWib,
      timeEnd: moment(Date.now() + conn.toMs(waktunya)).tz('Asia/Jakarta').format('DD/MM/YYYY HH:mm'),
      reminded: false, // Untuk pengguna baru
    };
  }

  // Kirimkan notifikasi ke pengguna
  let teks = `
––––––『 *PREMIUM SUCCESS* 』––––––

👤 *User:* ↓
• *Name :* ${namanye}
• *Number:* ${nomernya.split("@")[0]}
• *Days:* ${conn.msToDate(conn.toMs(waktunya))}
• *Countdown:* ${conn.toMs(waktunya)}
• *Time order:* ${timeWib}
• *Time end:* ${moment(Date.now() + conn.toMs(waktunya)).tz('Asia/Jakarta').format('DD/MM/YYYY HH:mm')}

📮 *Note:* ↓
• Bot yang sudah di order tidak dapat di refund
• Ketik .menu untuk mengakses bot
• Ketik .cekprem untuk melihat sisa order
• Lapor ke owner jika bot tidak berfungsi
• Silakan hubungi owner untuk order bot
• Owner wa.me/${global.nomerOwner}
`;

  // Kirim pesan ke pengguna dan admin
  await sleep(2000);
  log(nomernya)
  conn.sendMessage(nomernya, { text: teks });
  m.reply(teks);
}






handler.help = ['addprem [@user] <days>'];
handler.tags = ['owner'];
handler.command = /^(add|tambah|\+)p(rem)?$/i;
handler.owner = true;

export default handler;
