import fs from "fs-extra";
import { exec } from "child_process"; // tetap pakai convert dari imagemagick
import { spawn } from "child_process"; // untuk ffmpeg
import ffmpegPath from "ffmpeg-static"; // ganti fluent-ffmpeg


let handler = async (m, { conn, setReply }) => {
  const isQuotedSticker =
    m.type === "extendedTextMessage" && m.content.includes("stickerMessage");
  const p = m.quoted ? m.quoted : m 

  if (isQuotedSticker) {
    setReply("⏳ Tunggu bentar, lagi di-convert nih...");
    let file = await p.download(true)
    let outGif = `./${getRandomFile(".gif")}`;
    let outMp4 = `./${getRandomFile(".mp4")}`;

    // Step 1: WebP ➜ GIF pakai imagemagick
    exec(`convert ${file} ${outGif}`, (err) => {
      if (err) {
        console.log(err);
        return setReply(`❌ Gagal convert ke GIF\n${err}`);
      }

      // Step 2: GIF ➜ MP4 pakai ffmpeg-static
      const ffmpeg = spawn(ffmpegPath, [
        "-y", // overwrite file
        "-i", outGif,
        "-vf", "crop=trunc(iw/2)*2:trunc(ih/2)*2", // crop untuk codec kompatibel
        "-b:v", "0",
        "-crf", "25",
        "-pix_fmt", "yuv420p",
        outMp4,
      ]);

      ffmpeg.stderr.on("data", (data) => {
        //console.error(`[ffmpeg] ${data}`);
      });

      ffmpeg.on("exit", async (code) => {
        if (code !== 0) {
          setReply(`❌ Gagal convert ke MP4 (kode ${code})`);
        } else {
          await conn.sendMessage(
            m.chat,
            { video: fs.readFileSync(outMp4), gifPlayback: true, caption: "✅ Nih hasilnya!" },
            { quoted: m }
          );
        }

        // Hapus file sementara   conn.sendMessage(m.chat, {  video: buffer });
        [file, outGif, outMp4].forEach((f) => fs.existsSync(f) && fs.unlinkSync(f));
      });
    });
  } else {
    setReply("❌ Reply sticker WebP untuk di-convert ke MP4!");
  }
};

handler.help = ["tomp4"];
handler.tags = ["converter"];
handler.command = ["togif"];
export default handler;
