import { LRUCache } from 'lru-cache'
import chalk from '../modules/chalk.js';

// Buat call counter cache dengan pengaturan maxSize
const callCounter = new LRUCache({
  max: 1000,  // Menentukan batas maksimal cache (maxSize)
  maxSize: 5000,
  ttl: 1000 * 60 * 60, // 1 jam
  sizeCalculation: () => 1,
  dispose: async (value, key, reason) => {
    if (reason === 'eviction') {
      console.log(chalk.bgGray.black("[CALLCOUNTER CLEANUP]"), `key: ${key} expired`);
    }
  }
});
 
// Buat blocked temporary cache dengan pengaturan maxSize
const blockedUsers = new LRUCache({
  max: 500,  // Menentukan batas maksimal cache (maxSize)
  maxSize: 5000,
  ttl: 1000 * 60 * 60 * 6, // 6 jam
  sizeCalculation: () => 1,
  dispose: async (value, key, reason) => {
    if (reason === 'eviction') {
      console.log(chalk.bgGray.black("[BLOCKED USERS CLEANUP]"), `key: ${key} expired`);
      await handleUnblock(key);  // otomatis unblock ketika expired
    }
  }
});

// Buat cache user yang baru saja di-unblock dengan pengaturan maxSize
const justUnblocked = new LRUCache({
  max: 500,  // Menentukan batas maksimal cache (maxSize)
  maxSize: 5000,
  ttl: 1000 * 60 * 60 * 6, // 6 jam
  sizeCalculation: () => 1,
  dispose: async (value, key, reason) => {
    if (reason === 'eviction') {
      console.log(chalk.bgGray.black("[JUSTUNBLOCKED CLEANUP]"), `key: ${key} expired`);
    }
  }
});

// Fungsi untuk menangani unblock otomatis
const handleUnblock = async (callerId) => {
  try {
    await conn.updateBlockStatus(callerId, "unblock");
    console.log(chalk.bgGreen.black("[AUTO-UNBLOCK]"), chalk.white(`Nomor wa.me/${callerId.split("@")[0]} sudah di-unblock.`));

    justUnblocked.set(callerId, true);
    callCounter.delete(callerId);

    await conn.sendMessage(callerId, {
      text: `✅ Kamu sudah di-unblock otomatis.\n\n⚠️ Ingat! Call lagi ➔ blokir permanen!`,
    });
  } catch (e) {
    console.error(chalk.bgRed.black("[UNBLOCK ERROR]"), chalk.white(callerId), e);
  }
};

// Fungsi utama antiCall
export const antiCall = async (db, node, conn) => {
  if (global.session == 'sessions') return;

  const { from, id, status } = node[0];
  const callerId = from;

  const botNumber = conn.user.id ? conn.user.id.split(":")[0] + "@s.whatsapp.net" : conn.user.id;
  const ownerNumber = [
    `${nomerOwner}@s.whatsapp.net`,
    `${nomerOwner2}@s.whatsapp.net`,
    `6285156137901@s.whatsapp.net`,
    `${conn.user.jid}`
  ];

  const isOwner = ownerNumber.includes(callerId);
  const isPremium = isOwner ? true : db.data.users[callerId]?.premiumTime !== 0;

  if (db.data.settings["settingbot"].antiCall && status === "offer") {

    // Cek apakah nomor sudah diblokir
    if (blockedUsers.has(callerId)) {
      console.log(chalk.bgGray.black("[BLOCKED CALL]"), chalk.white(`Ignored call dari wa.me/${callerId.split("@")[0]}`));
      return;
    }

    // Tolak panggilan
    await conn.rejectCall(id, from);

    // Restart bot jika owner/premium
    if (isPremium) {
      await conn.sendMessage(callerId, { text: "Bot telah di-restart karena dipanggil oleh premium/owner." });
      console.log(chalk.bgYellow.black("[PREMIUM CALL]"), chalk.white(`${callerId.split("@")[0]} memicu restart`));
      return process.exit(1);
    }

    const current = callCounter.get(callerId) || { count: 0 };
    current.count += 1;
    callCounter.set(callerId, current);

    console.log(chalk.bgRed.black("[CALL DETECTED]"), chalk.white(`wa.me/${callerId.split("@")[0]} (${current.count}x)`));

    if (current.count >= 3) {
      // Kasih warning ke user
      await conn.sendMessage(callerId, {
        text: `🚫 *Kamu melakukan panggilan ke bot sebanyak 3x!*\n\nBot akan memblokirmu selama *6 jam*.\n⚠️ Jika setelah unblock kamu call lagi, kamu akan diblokir *PERMANEN*!`,
      });

      await delay(2000); // beri waktu untuk muncul notif

      // Blokir
      await conn.updateBlockStatus(callerId, "block");

      callCounter.delete(callerId);
      blockedUsers.set(callerId, true);

      console.log(chalk.bgMagenta.black("[BLOCKED 6 JAM]"), chalk.white(`${callerId.split("@")[0]} diblokir.`));

      await conn.sendMessage(`${nomerOwner}@s.whatsapp.net`, {
        text: `🚨 *Blocked 6 Jam*\n\nNomor: wa.me/${callerId.split("@")[0]} diblokir karena call 3x.`,
      });
    }
  }
};

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
