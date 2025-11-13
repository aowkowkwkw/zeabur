 

let handler = async (m, { q, conn, isOwner, setReply }) => {
 
 
  const isQuotedViewOnce =
    m.type === "extendedTextMessage" && m.content.includes("viewOnceMessage");
  const p = m.quoted ? m.quoted :  m 
  let mime = (p.msg || p).mimetype || '';
  const { downloadContentFromMessage } = (await import("baileys")).default;

  if (/image|video|audio/.test(mime)) {

    if (isQuotedViewOnce) {

        if (p.seconds > 11) return m.reply("Maksimal 10 detik!")
      let view = m.quoted.message;
      let Type = Object.keys(view)[0];
      let media = await downloadContentFromMessage(
        view[Type],
        Type == "imageMessage" ? "image" : "video"
      );
      let buffer = Buffer.from([]);
      for await (const chunk of media) {
        buffer = Buffer.concat([buffer, chunk]);
      }

      conn.toSticker(m.chat, buffer, m);
    } else {
      if (p.seconds > 11) return m.reply("Maksimal 10 detik!");
      const media = await p.download();
      conn.toSticker(m.chat, media, m);
    }
  }
};
handler.help = ["reply viewonce"];
handler.tags = ["admin"];
handler.command = ["s", "sticker"];
export default handler;
