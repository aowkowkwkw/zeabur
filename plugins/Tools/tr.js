let handler = async (m, { args, prefix, command }) => {
  let defaultLang = "en";
  let err = `
Contoh:
${prefix + command} <lang> [text]
${prefix + command} id your messages
Daftar bahasa yang didukung: https://cloud.google.com/translate/docs/languages
`.trim();

  let lang = args[0];
  let text = args.slice(1).join(" ");

  // Jika arg pertama bukan kode 2 huruf, default ke en dan gabung semua arg sebagai text
  if (!lang || lang.length !== 2) {
    lang = defaultLang;
    text = args.join(" ");
  }

  // Jika tidak ada teks, cek quoted message
  if (!text && m.quoted && m.quoted.text) text = m.quoted.text;

  if (!text) return m.reply(err);

  try {
    // request ke API translate Google gratis
    let res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(text)}`);

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    let json = await res.json();

    // Ambil hasil translate dari response json
    let result = json[0].map(item => item[0]).join("");

    m.reply(result);
  } catch (e) {
    // Jika error, balas error dan contoh penggunaan
    m.reply(`Error saat translate: ${e.message}\n\n${err}`);
  }
};

handler.help = ["translate"];
handler.tags = ["tools"];
handler.command = ["tr", "translate"];

export default handler;
