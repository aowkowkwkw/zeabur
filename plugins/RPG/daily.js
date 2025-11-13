const cooldown = 79200000; // 22 jam

function getDynamicRewards(level) {
  const exp = getRandomInt(level * 100, level * 500);
  const money = getRandomInt(level * 80, level * 250);
  const potion = Math.max(1, Math.floor(level / 5));
  return { exp, money, potion };
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let handler = async (m, { usedPrefix }) => {
  let user = global.db.data.users[m.sender];

  if (new Date() - user.lastclaim < cooldown) {
    let remaining = user.lastclaim + cooldown - new Date();
    let hours = Math.floor(remaining / 3600000);
    let minutes = Math.floor((remaining % 3600000) / 60000);
    return m.reply(
      `🕒 Kamu sudah klaim hadiah harian hari ini!\n⏳ Silakan tunggu *${hours} jam ${minutes} menit* lagi untuk klaim berikutnya.`
    );
  }

  const level = user.level || 1;
  const rewards = getDynamicRewards(level);
  let text = "";

  for (let key in rewards) {
    if (!(key in user)) continue;
    user[key] += rewards[key];
    text += `➠ ${global.rpg.emoticon(key)} ${key}: ${rewards[key]}\n`;
  }

  user.lastclaim = new Date() * 1;

  m.reply(
    `🎁 Kamu berhasil klaim hadiah harianmu!
📊 Level: ${level}
${text}`
  );
};

handler.help = ["daily", "claim"];
handler.tags = ["xp"];
handler.command = /^(daily|claim)$/i;
handler.register = true;
handler.group = true;
handler.rpg = true;

export default handler;
