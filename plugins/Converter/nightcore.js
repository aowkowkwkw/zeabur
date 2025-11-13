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
    let medoi = await p.download(true) ;
    let ran = getRandomFile(".mp3");

    // Build ffmpeg args for audio filter nightcore effect
    const args = [
      "-i",
      medoi,
      "-af",
      "atempo=1.06,asetrate=44100*1.25",
      "-y", // overwrite output
      ran,
    ];

    const ffmpeg = spawn(ffmpegPath, args);

    ffmpeg.on("error", async (err) => {
      await fs.unlink(medoi).catch(() => {});
      await fs.unlink(ran).catch(() => {});
      console.error(err);
      setReply(`Error: ${err.message || "Terjadi kesalahan saat mengonversi audio."}`);
    });

    ffmpeg.on("close", async (code) => {
      if (code !== 0) {
        await fs.unlink(medoi).catch(() => {});
        await fs.unlink(ran).catch(() => {});
        return setReply(`FFmpeg exited with code ${code}`);
      }

      let buffer = await fs.readFile(ran);
      await conn.sendMessage(
        m.chat,
        { mimetype: "audio/mp4", ptt: true, audio: buffer },
        { quoted: m }
      );

      await fs.unlink(medoi).catch(() => {});
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
handler.command = ["nightcore"];

export default handler;
