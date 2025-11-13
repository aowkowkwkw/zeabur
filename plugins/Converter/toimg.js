import fs from "fs-extra";
import { spawn } from "child_process";
import ffmpegPath from "ffmpeg-static";

let handler = async (m, { conn, setReply }) => {
  const isQuotedSticker =
    m.type === "extendedTextMessage" && m.content.includes("stickerMessage");
  const p = m.quoted ? m.quoted : m 

  if (!isQuotedSticker) return setReply("Reply stickernya");

  setReply("Tunggu sebentar...");

  try {
    let media = await p.download(true)
    let ran = getRandomFile(".png");

    // Jalankan ffmpeg untuk convert webp ke png
    const ffmpeg = spawn(ffmpegPath, [
      "-i",
      media,
      ran
    ]);

    ffmpeg.on("error", (err) => {
      fs.unlinkSync(media);
      if (fs.existsSync(ran)) fs.unlinkSync(ran);
      setReply(err.message || "Terjadi kesalahan saat mengonversi sticker.");
    });

    ffmpeg.on("close", async (code) => {
      if (code !== 0) {
        fs.unlinkSync(media);
        if (fs.existsSync(ran)) fs.unlinkSync(ran);
        return setReply(`FFmpeg exited with code ${code}`);
      }
      let buffer = fs.readFileSync(ran);
      await conn.sendMessage(m.chat, { caption: "Nih", image: buffer });
      fs.unlinkSync(media);
      fs.unlinkSync(ran);
    });
  } catch (err) {
    setReply(err.message || "Terjadi kesalahan saat mengunduh sticker.");
  }
};

handler.help = ["converter"];
handler.tags = ["internet"];
handler.command = ["toimg", "toimage"];

export default handler;
