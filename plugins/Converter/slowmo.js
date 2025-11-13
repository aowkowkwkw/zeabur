import fs from "fs-extra";
import { spawn } from "child_process";
import ffmpegPath from "ffmpeg-static";

let handler = async (m, { conn, setReply }) => {
  const isQuotedAudio =
    m.type === "extendedTextMessage" && m.content.includes("audioMessage");
  const p = m.quoted ? m.quoted : m 

  if (!isQuotedAudio) {
    return setReply("Reply audionya");
  }

  setReply("Tunggu sebentar...");

  try {
    let media = await p.download(true)
    let ran = getRandomFile(".mp3");

    // args untuk ffmpeg dengan filter audio slowmo
    const args = [
      "-i",
      media,
      "-af",
      "atempo=4/4,asetrate=44500*5/6",
      "-y", // overwrite output tanpa konfirmasi
      ran,
    ];

    const ffmpeg = spawn(ffmpegPath, args);

    ffmpeg.on("error", async (err) => {
      await fs.unlink(media).catch(() => {});
      await fs.unlink(ran).catch(() => {});
      console.error(err);
      setReply(`Error: ${err.message || "Terjadi kesalahan saat mengonversi audio."}`);
    });

    ffmpeg.on("close", async (code) => {
      if (code !== 0) {
        await fs.unlink(media).catch(() => {});
        await fs.unlink(ran).catch(() => {});
        return setReply(`FFmpeg exited with code ${code}`);
      }

      let buff = await fs.readFile(ran);
      await conn.sendMessage(
        m.chat,
        { mimetype: "audio/mp4", ptt: true, audio: buff },
        { quoted: m }
      );

      await fs.unlink(media).catch(() => {});
      await fs.unlink(ran).catch(() => {});
    });
  } catch (err) {
    setReply(`Error: ${err.message || "Terjadi kesalahan saat mengunduh atau mengonversi audio."}`);
  }
};

handler.help = ["converter"];
handler.tags = ["internet"];
handler.command = ["slow", "slowmo"];

export default handler;
