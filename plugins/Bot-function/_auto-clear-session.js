// launcher.js by officialdittaz – Optimized by GitHub Copilot


import fs from "fs-extra";

let isCleaning = false;

async function autoCleanSession() {
  const delSessi = db.data.settings['settingbot'].autoDelSessi;
  const fileLength = db.data.settings['settingbot'].clearSessionFile;

  if (!delSessi || !fileLength || fileLength < 10) return; // Validasi minimum fileLength

  try {
    const files = await fs.readdir(`./${global.session}`);
    const filteredArray = files.filter(file =>
      file.startsWith("pre-key") ||
      file.startsWith("sender-key") ||
      file.startsWith("session-")
    );

    if (filteredArray.length >= fileLength && !isCleaning) {
      isCleaning = true;
      console.log(`🧹 Membersihkan ${filteredArray.length} file sampah session...`);

      // Proses file dalam batch kecil (contoh: 100 file sekaligus)
      for (const file of filteredArray.slice(0, 100)) {
        const filePath = `./${global.session}/${file}`;
        if (await fs.pathExists(filePath)) {
          await fs.unlink(filePath);
        }
      }

      console.log(`✅ Berhasil menghapus ${filteredArray.length} file sampah session.`);
      isCleaning = false;
    }
  } catch (err) {
    console.error("❌ Gagal membersihkan session:", err);
    isCleaning = false;
  }
}

// Jalankan pembersihan setiap 1 menit
setInterval(autoCleanSession, 60_000);

let handler = (m) => m;
handler.before = async function (m, { conn }) {
  // Tidak perlu menaruh logika autoCleanSession di sini lagi
};

export default handler;