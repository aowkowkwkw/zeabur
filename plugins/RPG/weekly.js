const cooldown = 604800000; // 7 hari

function getWeeklyRewards(level) {
  const exp = getRandomInt(level * 1000, level * 5000);
  const money = getRandomInt(level * 1200, level * 7000);
  const potion = Math.max(2, Math.floor(level / 3));
  return { exp, money, potion };
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let handler = async (m, { usedPrefix }) => {
  let user = global.db.data.users[m.sender];

  if (new Date() - user.lastweekly < cooldown) {
    let remaining = user.lastweekly + cooldown - new Date();
    let days = Math.floor(remaining / 86400000);
    let hours = Math.floor((remaining % 86400000) / 3600000);
    let minutes = Math.floor((remaining % 3600000) / 60000);
    return m.reply(
      `📆 Kamu sudah klaim hadiah mingguanmu!\n⏳ Silakan tunggu *${days} hari ${hours} jam ${minutes} menit* lagi untuk klaim berikutnya.`
    );
  }

  const level = user.level || 1;
  const rewards = getWeeklyRewards(level);
  let text = `🎉 Kamu berhasil klaim hadiah mingguan!\n📊 Level: ${level}\n`;

  for (let key of Object.keys(rewards)) {
    if (!(key in user)) continue;
    user[key] += rewards[key];
    text += `*+${rewards[key]}* ${global.rpg.emoticon(key)} ${key}\n`;
  }

  user.lastweekly = new Date() * 1;

  m.reply(text.trim());
};

handler.help = ["weekly"];
handler.tags = ["rpg"];
handler.command = /^weekly$/i;
handler.register = true;
handler.group = true;
handler.cooldown = cooldown;
handler.rpg = true;

export default handler;
