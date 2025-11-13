let handler = (m) => m;

// Cache untuk mencegah panggilan `groupFetchAllParticipating` terus-menerus
let groupListCache = [];
let lastFetch = 0;
const maxCacheSize = 100; // Maksimal cache 100 grup
const cacheDuration = 3600000; // Hanya simpan grup dalam 1 jam terakhir

handler.before = async function (m, { conn }) {
  const groupTime = global.db.data.others['groupTime'] || [];
  global.db.data.others['groupTime'] = groupTime;

  // Cek apakah interval sudah aktif, jika sudah, jangan buat lagi
  if (handler._interval) return;

  // Bersihkan interval sebelumnya jika ada
  handler._interval = setInterval(async () => {
    if (groupTime.length === 0) return;

    const now = Date.now();
    const shouldRefetch = now - lastFetch > 1000 * 60 * 10; // refresh setiap 10 menit
    if (shouldRefetch) {
      const groups = await conn.groupFetchAllParticipating().catch(() => ({}));
      groupListCache = Object.values(groups);
      lastFetch = now;
    }

    // Hapus grup dari cache yang sudah lebih dari 1 jam
    groupListCache = groupListCache.filter(group => now - group.lastFetched < cacheDuration);

    // Batasi ukuran cache
    if (groupListCache.length > maxCacheSize) {
      groupListCache = groupListCache.slice(0, maxCacheSize); // Batasi jumlah cache
    }

    for (let id of groupTime) {
      const chat = global.db.data.chats[id];
      if (!chat) continue;

      const isValid = groupListCache.some(g => g.id === id && !g.isCommunity && !g.isCommunityAnnounce);
      if (!isValid) {
        groupTime.splice(groupTime.indexOf(id), 1); // Hapus grup yang tidak valid
        console.log(`Grup ${id} tidak valid. Dihapus dari jadwal.`);
        continue;
      }

      if (chat.open && now >= chat.open) {
        await conn.groupSettingUpdate(id, 'not_announcement').catch(console.error);
        await conn.sendMessage(id, { text: '*Tepat waktu*\nGrup telah dibuka, semua anggota dapat mengirim pesan.' });
        chat.open = 0;
      }

      if (chat.close && now >= chat.close) {
        await conn.groupSettingUpdate(id, 'announcement').catch(console.error);
        await conn.sendMessage(id, { text: '*Tepat waktu*\nGrup telah ditutup, hanya admin yang bisa mengirim pesan.' });
        chat.close = 0;
      }
    }
  }, 30000); // Interval 30 detik
};

// 🧯 Bersihkan interval saat proses dihentikan
const stopCleaning = () => {
  if (handler._interval) {
    clearInterval(handler._interval);
    //console.log("🛑 Pembersih otomatis dihentikan. Auto Open Close Gc");
  }
};

// Tangani berbagai sinyal keluar dari proses
["SIGINT", "SIGTERM", "exit", "uncaughtException"].forEach(signal => {
  process.on(signal, stopCleaning);
});

export default handler;