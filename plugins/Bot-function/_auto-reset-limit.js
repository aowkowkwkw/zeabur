// launcher.js by officialdittaz – Optimized with Debug Logs and Full Comments by ChatGPT

 

// Buat handler dasar (wajib) untuk struktur plugin
let handler = (m) => m;

// Fungsi utama yang dijalankan sebelum proses lain (before message handling)
handler.before = async function (m, { conn }) {
  // Ambil data user dari database berdasarkan ID pengirim
  let user = global.db.data.users[m.sender];

  // Jika user tidak ada di database, keluar dari fungsi
  if (!user) {
    console.log(`[LAUNCHER] Data user ${m.sender} tidak ditemukan.`);
    return;
  }

  // Cek apakah waktu saat ini sudah melewati waktu reset user
  if (Date.now() >= user.resetLimit) {
   // console.log(`[LAUNCHER] Cek reset untuk user ${m.senderNumber}`);


      // Reset limit user ke nilai global default
      if(user.limit < global.limitCount) user.limit = global.limitCount;
      if(user.glimit < global.gameCount) user.glimit = global.gameCount;

      // Atur waktu resetLimit berikutnya ke 1 hari dari sekarang
      user.resetLimit = Date.now() + conn.toMs('1d');

      console.log(`[LAUNCHER] Limit user ${m.senderNumber} telah di-reset ke ${user.limit}.`);
    
  }
};

// Export handler agar bisa dipakai di sistem bot
export default handler;
