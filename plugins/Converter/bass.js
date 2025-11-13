import fs from "fs-extra";
import { spawn } from "child_process";
import ffmpegPath from "ffmpeg-static";

 

let handler = async (m, { conn, setReply }) => {
  const isQuotedAudio = m.type === "extendedTextMessage" && m.content.includes("audioMessage");
  const p = m.quoted ? m.quoted : m 

  if (!isQuotedAudio) {
    return setReply("Reply audionya");
  }

  setReply("Tunggu sebentar...");

  try {
    const inputPath = await p.download(true) ;
    const outputPath = getRandomFile(".mp3");

    const args = [
      "-i", inputPath,
      "-af", "equalizer=f=50:width_type=o:width=1:g=10",
      "-y", // overwrite output file if exists
      outputPath
    ];

    const ffmpeg = spawn(ffmpegPath, args);

    ffmpeg.stderr.on("data", data => {
      // Optional: console.log(`ffmpeg stderr: ${data}`);
    });

    ffmpeg.on("close", async (code) => {
      if (code === 0) {
        try {
          await fs.unlink(inputPath);
          const buffer = await fs.readFile(outputPath);
          await conn.sendMessage(m.chat, { mimetype: "audio/mp4", ptt: true, audio: buffer }, { quoted: m });
          await fs.unlink(outputPath);
        } catch (err) {
          setReply(`Error saat mengirim audio: ${err.message}`);
        }
      } else {
        await fs.unlink(inputPath).catch(() => {});
        await fs.unlink(outputPath).catch(() => {});
        setReply(`Gagal mengonversi audio, ffmpeg exit code: ${code}`);
      }
    });

  } catch (err) {
    setReply(`Error: ${err.message || "Terjadi kesalahan saat mengunduh atau mengonversi audio."}`);
  }
};

handler.help = ["converter"];
handler.tags = ["internet"];
handler.command = ["bass"];

export default handler;
