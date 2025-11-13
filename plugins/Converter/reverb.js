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
    let media = await p.download(true) ;
    let ran = getRandomFile(".mp3");

    // args ffmpeg dengan complex filter 'afir=dry=10:wet=13'
    // input dua kali media untuk filter afir yang butuh dua input
    const args = [
      "-i",
      media,
      "-i",
      media,
      "-filter_complex",
      "[0][1]afir=dry=10:wet=13",
      "-y", // overwrite output
      ran,
    ];

    const ffmpeg = spawn(ffmpegPath, args);

    ffmpeg.on("error", async (err) => {
      await fs.unlink(media).catch(() => {});
      await fs.unlink(ran).catch(() => {});
      console.error(err);
      setReply(`_*TERJADI KESALAHAN!*_`);
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
    setReply(
      `Error: ${err.message || "Terjadi kesalahan saat mengunduh atau mengonversi audio."}`
    );
  }
};

handler.help = ["converter"];
handler.tags = ["internet"];
handler.command = ["reverb"];

export default handler;
