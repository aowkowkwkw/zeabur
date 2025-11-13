import moment from '../modules/moment.js'

function startPremiumChecker(conn, db) {
  const CHECK_INTERVAL = 5000; // 5 detik
  let isRunning = true;

  async function loop() {
    while (isRunning) {
      try {
        const currentTime = Date.now();
        const data = db.data.users;
        const ownerJid = global.ownerBot;

        for (const key in data) {
          if (!Object.prototype.hasOwnProperty.call(data, key)) continue;

          const item = data[key];
          const timeLeft = item.premiumTime - currentTime;

          // ❌ Jika sudah expired
          if (
            item.premium &&
            item.premiumTime > 0 &&
            timeLeft <= 0
          ) {
            const expiredText = "❌ Premium kamu telah berakhir. Untuk berlangganan kembali, silakan hubungi owner.";

            try {
              await conn.sendMessage(key, { text: expiredText });
            } catch (err) {
              console.error("❌ Gagal kirim pesan expired ke", key, err);
            }

            const expiredTime = moment().tz('Asia/Jakarta').format('DD MMM YYYY HH:mm');
            const ownerNotif = `📛 Premium user telah berakhir!\n\n👤 User: ${key.split('@')[0]}\n⏰ Waktu: ${expiredTime} WIB`;

            try {
              await conn.sendMessage(ownerJid, { text: ownerNotif });
              console.log(`📬 Notifikasi ke owner: premium ${key} habis`);
            } catch (err) {
              console.error("❌ Gagal kirim notif ke owner:", err);
            }

            // Reset status
            item.premium = false;
            item.premiumTime = 0;
            item.reminded = false; // Optional, kalau kamu masih pakai properti ini
          }
        }
      } catch (err) {
        console.error("❌ Error di loop PremiumChecker:", err);
      }

      await new Promise(res => setTimeout(res, CHECK_INTERVAL));
    }

    console.log("⛔ PremiumChecker berhenti.");
  }

  loop();

  // Fungsi untuk stop checker
  return () => {
    isRunning = false;
  };
}

export function initPremiumChecker(conn, db) {
  if (!global._premiumCheckerStarted) {
    console.log("✅ Premium Checker activated");
    global.stopPremiumChecker = startPremiumChecker(conn, db);
    global._premiumCheckerStarted = true;
  }
}
