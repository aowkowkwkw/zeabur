import fs from "fs-extra";
import { spawn } from "child_process";
import ffmpegPath from "ffmpeg-static";

let handler = async (m, { conn, setReply }) => {
  const isQuotedAudio = m.type === "extendedTextMessage" && m.content.includes("audioMessage");
  const p = m.quoted ? m.quoted : m ;

  if (!isQuotedAudio) {
    return setReply("Reply audionya");
  }

  setReply("Tunggu sebentar...");

  try {
    let media = await p.download(true)
    let ran = getRandomFile(".mp3");

    await new Promise((resolve, reject) => {
      const ffmpeg = spawn(ffmpegPath, [
        "-i", media,
        "-y",
        ran
      ]);

      ffmpeg.stderr.on("data", () => {}); // Optional: log output

      ffmpeg.on("error", (err) => reject(err));

      ffmpeg.on("close", (code) => {
        if (code === 0) resolve();
        else reject(new Error(`ffmpeg exited with code ${code}`));
      });
    });

    fs.unlinkSync(media);
    let buffer = fs.readFileSync(ran);
    await conn.sendMessage(m.chat, { audio: buffer, mimetype: "audio/mp4", ptt: true }, { quoted: m });
    fs.unlinkSync(ran);

  } catch (err) {
    try { fs.unlinkSync(media); } catch {}
    try { fs.unlinkSync(ran); } catch {}
    setReply(`Error: ${err.message || "Terjadi kesalahan saat mengunduh atau mengonversi audio."}`);
  }
};

handler.help = ["converter"];
handler.tags = ["internet"];
handler.command = ["toptt"];

export default handler;
