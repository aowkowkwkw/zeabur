import fs from "fs";
import { spawn } from "child_process";
import ffmpegPath from "ffmpeg-static";

let handler = async (m, { q, conn, args, prefix, setReply, command }) => {
  const isImage = m.type === "imageMessage";
  const isQuotedImage =
    m.type === "extendedTextMessage" && m.content.includes("imageMessage");
  const p = m.quoted ? m.quoted : m 

  if (isQuotedImage || isImage) {
    if (!q)
      return setReply(
        `Masukan ukuran panjangxlebar, contoh ${prefix + command} 300x300`
      );

    setReply(mess.wait);
    let panjang = q.split("x")[0];
    let lebar = q.split("x")[1];

    let media = await p.download(true)
    let output = getRandomFile(".jpeg");

    const argsFFmpeg = [
      "-i", media,
      "-vf", `scale=${panjang}:${lebar}`,
      output
    ];

    const ff = spawn(ffmpegPath, argsFFmpeg);

    ff.on("error", (err) => {
      fs.unlinkSync(media);
      setReply(`FFmpeg error: ${err.message}`);
    });

    ff.on("close", async (code) => {
      if (code !== 0) {
        fs.unlinkSync(media);
        return setReply(`FFmpeg process exited with code ${code}`);
      }

      try {
        let buffer = fs.readFileSync(output);
        await conn.sendMessage(
          m.chat,
          { image: buffer, caption: `Nih ${q}` },
          { quoted: m }
        );
      } catch (e) {
        setReply("Gagal kirim gambar hasil resize.");
      } finally {
        fs.unlinkSync(media);
        fs.unlinkSync(output);
      }
    });
  } else {
    setReply("Reply Imagenya");
  }
};

handler.help = ["resize"];
handler.tags = ["tools"];
handler.command = ["resize"];

export default handler;
