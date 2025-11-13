import fs from "fs-extra";
import { spawn } from "child_process";
import ffmpegPath from "ffmpeg-static";

let handler = async (m, { conn, args, setReply }) => {
  const isQuotedAudio = m.type === "extendedTextMessage" && m.content.includes("audioMessage");
  const p = m.quoted ? m.quoted : m 

  if (Number(args[0]) >= 11) return setReply("Maksimal volume adalah 10");

  if (!isQuotedAudio) {
    return setReply("Reply audio!");
  }

  setReply("Tunggu sebentar...");

  try {
    let media3 = await p.download(true)
    let rname = getRandomFile(".mp3");

    // Fungsi convert dengan filter volume pakai ffmpeg-static
    const adjustVolume = (input, output, volume) =>
      new Promise((resolve, reject) => {
        const ffmpeg = spawn(ffmpegPath, [
          "-i", input,
          "-filter:a", `volume=${volume}`,
          "-y",
          output,
        ]);

        ffmpeg.stderr.on("data", () => {}); // optional log

        ffmpeg.on("error", (err) => reject(err));

        ffmpeg.on("close", (code) => {
          if (code === 0) resolve();
          else reject(new Error(`ffmpeg exited with code ${code}`));
        });
      });

    await adjustVolume(media3, rname, args[0]);

    let jadie = await fs.readFile(rname);
    await conn.sendMessage(m.chat, { audio: jadie, mimetype: "audio/mp4", ptt: true }, { quoted: m });

    await fs.unlink(media3);
    await fs.unlink(rname);
  } catch (err) {
    try { await fs.unlink(media3); } catch {}
    try { await fs.unlink(rname); } catch {}
    setReply(`Error: ${err.message || "Terjadi kesalahan saat mengonversi audio."}`);
  }
};

handler.help = ["converter"];
handler.tags = ["internet"];
handler.command = ["volume"];

export default handler;
