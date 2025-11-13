const cooldown = 2592000000; // 30 hari

function getMonthlyRewards(level) {
  const exp = getRandomInt(level * 3000, level * 8000);
  const money = getRandomInt(level * 5000, level * 10000);
  const potion = Math.max(5, Math.floor(level / 2));
  const mythic = level >= 10 ? Math.floor(level / 10) : 0;
  const legendary = level >= 25 ? 1 : 0;
  return { exp, money, potion, mythic, legendary };
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let handler = async (m, { conn, usedPrefix }) => {
  const chat = global.db.data.chats[m.chat];
  if (chat.rpg === false && m.isGroup)
    return conn.sendButton(
      m.chat,
      "❗ Fitur RPG belum diaktifkan di grup ini.",
      wm,
      null,
      [["🔛 Aktifkan RPG", usedPrefix + "on rpg"]],
      m
    );

  const user = global.db.data.users[m.sender];

  if (new Date() - user.lastmonthly < cooldown) {
    let remaining = user.lastmonthly + cooldown - new Date();
    let days = Math.floor(remaining / 86400000);
    let hours = Math.floor((remaining % 86400000) / 3600000);
    let minutes = Math.floor((remaining % 3600000) / 60000);
    return m.reply(
      `📆 Kamu sudah klaim hadiah bulanan!\n⏳ Silakan tunggu *${days} hari ${hours} jam ${minutes} menit* lagi untuk klaim berikutnya.`
    );
  }

  const level = user.level || 1;
  const rewards = getMonthlyRewards(level);
  let text = `🎁 Hadiah Bulanan berhasil diklaim!\n📊 Level: ${level}\n`;

  for (let key in rewards) {
    if (!(key in user)) continue;
    user[key] += rewards[key];
    if (rewards[key] > 0)
      text += `*+${rewards[key]}* ${global.rpg.emoticon(key)} ${key}\n`;
  }

  user.lastmonthly = new Date() * 1;
  m.reply(text.trim());
};

handler.help = ["monthly"];
handler.tags = ["rpg"];
handler.command = /^monthly$/i;
handler.register = true;
handler.group = true;
handler.cooldown = cooldown;
handler.rpg = true;

export default handler;
