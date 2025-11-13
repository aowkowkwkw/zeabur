 

let handler = async (m, { conn, q, isOwner }) => {
  let sewa = Object.values(db.data.chats)
    .filter(i => i.expired > Date.now())
    .sort((a, b) => a.expired - b.expired); // Urutkan berdasarkan waktu expired


  let orderSummary = `\n––––––[ *LIST ORDER* ]––––––\n\n*Total order* : ${sewa.length}\n\n`;

  if (q) m.reply(orderSummary);

  for (let i of sewa) {
    let data;
    let stats
    try {
      data = conn.chats[i.id].metadata || await conn.groupMetadata(i.id);
      stats = true
    } catch {
      data = { subject: i.name, id: `${i.id}`, participants: [] };
      stats = false
    }

    i.name = data.subject;

    let durasi = conn.ms(i.expired - Date.now());
    let bulan = Math.floor(durasi.days / 30);
    let hari = durasi.days - bulan * 30;

    // Tambahkan status sewa
    let status = durasi.days <= 3 ? "⚠️ *Hampir Habis!*" :
                 durasi.days <= 7 ? "⏳ *1 Minggu Lagi*" :
                 "✅ *Aktif*";

    let text = `• *Group* : ${data.subject}
• *ID* : ${m.isGroup ? "Private only" : isOwner ? data.id : "Owner only"}
• *Creator* : ${i.creator}
• *Expired* : ${bulan} Bulan ${hari} Hari ${durasi.hours} Jam ${durasi.minutes} Menit
• *Status* : ${stats?status:"❌ *Tidak Aktif*"}
• *Link* : ${m.isGroup ? "Private only" : isOwner ? i.linkgc : "Owner only"}
• *Member* : ${data.participants.length || "Tidak diketahui"}
•·–––––––––––––––––––––––––·•\n\n`;

    orderSummary += text;

    if (q) {
      await sleep(1000);
      await conn.sendMessage(m.chat, { text });
    }
  }

  let teks =`📮 *Note:* ↓
• Jika status tidak aktif, berarti bot telah di kick
• Ketik .clearchats untuk menghapus data yang tidak aktif`
  if (!q) await m.reply(orderSummary + `\n\n${teks}\n\n${copyright} - ${calender}`);

  let bio = `Total order: ${sewa.length} group`;
  await conn.updateProfileStatus(transformText(bio)).catch(_ => _);
};

handler.help = ["listsewa"];
handler.tags = ["info"];
handler.command = /^(listsewa|sewalist|listorder)$/i;
handler.owner = true;

export default handler;
