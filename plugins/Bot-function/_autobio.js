let handler = (m) => m;

let lastOrderCount = null;
let lastUpdate = 0;

handler.before = async function () {
  const settings = global.db.data.settings["settingbot"];
  if (!settings) global.db.data.settings["settingbot"] = { autoBio: false, totalOrder: 0 };

  // Pastikan hanya satu interval dijalankan
  if (handler._interval) return;

  handler._interval = setInterval(async () => {
    try {
      const now = Date.now();
      const chats = Object.values(global.db.data.chats || {});
      const sewa = chats.filter((i) => i.expired && i.expired !== 0);
      const orderCount = sewa.length;

      if (!isNumber(settings.totalOrder)) settings.totalOrder = 0;
      if (!isNumber(lastOrderCount)) lastOrderCount = settings.totalOrder;

      // Hanya update jika jumlah order berubah dan autoBio aktif
      if (settings.autoBio && orderCount !== lastOrderCount && now - lastUpdate > 10000) {
        const bio = `📊 Total order: ${orderCount} group`;
        await conn.updateProfileStatus(bio).catch(console.error);
        lastOrderCount = orderCount;
        settings.totalOrder = orderCount;
        lastUpdate = now;
        console.log("✅ Bio berhasil diperbarui");
        conn.sendMessage(nomerOwner + "@s.whatsapp.net", {
          text: `✅ Bio berhasil diperbarui\n📊 Total order: ${orderCount} group`
        });
      }
    } catch (err) {
      console.error("❌ Error saat update autobio:", err);
    }
  }, 60000 * 60); // cek tiap 1 jam

  // Tambahkan logic untuk menghapus interval jika sudah tidak diperlukan
  // Misalnya jika bot di non-aktifkan atau saat ada kondisi tertentu
  // handler._interval bisa di-clear dengan `clearInterval(handler._interval)`
};

// Fungsi untuk membersihkan interval jika tidak diperlukan
handler.clearInterval = function () {
  if (handler._interval) {
    clearInterval(handler._interval);
    handler._interval = null;
    console.log("✅ Interval dihentikan untuk mencegah memory leak");
  }
};

export default handler;
