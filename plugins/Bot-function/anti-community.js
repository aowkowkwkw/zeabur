let handler = (m) => m;

const processed = global._antiCommunityCache || new Set();
global._antiCommunityCache = processed;

handler.before = async function (m, { conn }) {
  if (!m.isGroup || processed.has(m.chat)) return;

 // const metadata = await conn.groupMetadata(m.chat);
 // const isCommunity = metadata?.id?.endsWith('@g.us') && !!metadata?.parent;

  if (m.isCommunity) {
    processed.add(m.chat);
    setTimeout(() => processed.delete(m.chat), 10_000); // agar gak spam

    console.log('[ANTI-COMMUNITY] Bot masuk grup komunitas!');

    // Kirim notifikasi ke owner
    const teksNotif = `🚫 *ANTI KOMUNITAS TERPICU!*\n\n` +
      `Bot dimasukkan ke grup komunitas tanpa izin!\n\n` +
      `• *Nama Grup:* ${metadata.subject}\n` +
      `• *ID Grup:* ${m.chat}\n` +
      `• *Link:* https://chat.whatsapp.com/${metadata?.inviteCode || 'invite-tidak-tersedia'}\n\n` +
      `Bot otomatis keluar dari grup komunitas.`

    await conn.sendMessage(global.ownerBot, { text: teksNotif });

 

    await sleep(2000);
    await conn.groupLeave(m.chat);
  }
};

export default handler;
