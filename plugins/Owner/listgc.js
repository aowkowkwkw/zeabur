import moment from '../../modules/moment.js'

let handler = async (m, { conn, isOwner, setReply }) => {
  if (!isOwner) return await setReply(mess.only.owner);

  let getGroups = await conn.groupFetchAllParticipating();
  let groups = Object.values(getGroups);

  let groupReguler = groups.filter(g => !g.isCommunity && !g.isCommunityAnnounce);
  let groupCommunity = groups.filter(g => g.isCommunity);

  let teks = `
––––––[ *LIST SEMUA GRUP* ]––––––

📌 Total Grup Reguler: ${groupReguler.length}
📌 Total Komunitas: ${groupCommunity.length}

`;

  // Grup Reguler
  teks += `\n–––––––[ *GRUP REGULER* ]–––––––\n\n`;

  for (let metadata of groupReguler) {
    let chat = db.data.chats[metadata.id];
    teks += `◉ Nama : ${metadata.subject} ${
      chat
        ? chat.expired !== 0
          ? ""
          : "\n◉ Warning : Grup ini tidak ada dalam database order"
        : "\n◉ Warning : Grup ini tidak terdaftar dalam database bot"
    }\n◉ Owner : ${
      metadata.owner ? "@" + metadata.owner.split("@")[0] : "Tidak diketahui"
    }\n◉ ID : ${metadata.id}\n◉ Dibuat : ${moment(metadata.creation * 1000)
      .tz("Asia/Jakarta")
      .format("DD/MM/YYYY HH:mm:ss")}\n◉ Member : ${metadata.participants.length}\n\n•·–––––––––––––––––––––––––·•\n\n`;
  }

  // Komunitas
  teks += `\n–––––––[ *GRUP KOMUNITAS* ]–––––––\n\n`;

  for (let metadata of groupCommunity) {
    teks += `◉ Nama : ${metadata.subject}\n` +
            `◉ ID : ${metadata.id}\n` +
            `◉ Dibuat : ${moment(metadata.creation * 1000).tz("Asia/Jakarta").format("DD/MM/YYYY HH:mm:ss")}\n` +
            `◉ Member : ${metadata.participants.length}\n\n•·–––––––––––––––––––––––––·•\n\n`;
  }

  await conn.sendTextWithMentions(m.chat, teks.trim(), m);
};

handler.help = ["listgroupall"];
handler.tags = ["owner"];
handler.command = /^(listgroupall|listsemuagrup|listgc|listcommunity)$/i;
handler.owner = true;

export default handler;
