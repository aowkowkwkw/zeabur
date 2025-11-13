let handler = async (m, { q, conn, args, usedPrefix, command }) => {
  if (!q) return m.reply(`contoh ${usedPrefix + command} apa kabar?`);

  const data = await JSON_URL(`https://anabot.my.id/api/ai/chatgpt?prompt=${encodeURIComponent(q)}&apikey=freeApikey`);
  log(data)
  if (!data || !data.data.result) return m.reply('Gagal mengambil data dari API.');

  m.reply(data.data.result.chat.replace(/\*/g, ''));
};

handler.command = ["ai"];
export default handler;

async function JSON_URL(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('HTTP error! Status: ' + response.status);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching JSON:', error);
    return null;
  }
}
