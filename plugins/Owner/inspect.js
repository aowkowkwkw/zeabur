 

let handler = async (m, { conn, q, setReply }) => {
  if (!q || !q.includes("chat.whatsapp.com"))
    return setReply("❌ Tidak ada URL undangan grup yang valid!");

  const match = q.match(/chat\.whatsapp\.com\/([\w\d]+)/);
  if (!match) return setReply("❌ Format link salah.");

  const code = match[1];
  let info;

  try {
    info = await conn.groupGetInviteInfo(code);
  } catch (e) {
    return setReply("❌ Gagal mengambil data. Mungkin link sudah kadaluarsa atau bot tidak punya izin.");
  }

  const {
    id,
    subject,
    subjectOwner,
    subjectTime,
    desc,
    descOwner,
    descId,
    participants,
    size,
    creation,
    creator,
    ephemeralDuration,
    inviteCode,
    inviteExpiration,
  } = info;

  let teks = `
📄 *INSPEKSI LINK GRUP WHATSAPP*
────────────────────────
🆔 *Group ID:* ${id}
📛 *Nama Grup:* ${subject}
👑 *Pembuat Grup:* ${creator ? "@" + creator.split("@")[0] : "-"}
📅 *Tanggal Dibuat:* ${new Date(creation * 1000).toLocaleString("id-ID")}
👥 *Jumlah Member:* ${participants?.length || size || 0}

📝 *Deskripsi:* ${desc ? desc : "-"}
✍️ *Pembuat Deskripsi:* ${descOwner ? "@" + descOwner.split("@")[0] : "-"}
🆔 *ID Deskripsi:* ${descId || "-"}

🕐 *Waktu Ubah Subject:* ${
    subjectTime ? new Date(subjectTime * 1000).toLocaleString("id-ID") : "-"
  }
✍️ *Pengubah Subject:* ${subjectOwner ? "@" + subjectOwner.split("@")[0] : "-"}

🕓 *Durasi Ephemeral:* ${ephemeralDuration ? ephemeralDuration + " detik" : "Nonaktif"}
🔗 *Kode Undangan:* ${inviteCode || "-"}
⌛ *Kadaluarsa Invite:* ${
    inviteExpiration
      ? new Date(inviteExpiration * 1000).toLocaleString("id-ID")
      : "-"
  }

────────────────────────
${desc ? `📌 *Deskripsi Lengkap:*\n${desc}` : ""}
  `.trim();

  await conn.sendMessage(m.chat, {
    text: teks,
    mentions: [creator, descOwner, subjectOwner]
      .filter(Boolean)
      .map((v) => v.endsWith("@s.whatsapp.net") ? v : v + "@s.whatsapp.net"),
  }, { quoted: m });
};

handler.help = ["inspect <link grup>"];
handler.tags = ["owner"];
handler.command = ["inspect"];
handler.owner = true;

export default handler;
