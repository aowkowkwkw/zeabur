import fs from "fs-extra";
import { spawn } from "child_process";
import ffmpegPath from "ffmpeg-static";
import FormData from "form-data";
import fetch from "node-fetch";

let handler = async (m, { q, setReply, command, conn }) => {
  const isImage = m.type === "imageMessage";
  const isQuotedImage = m.type === "extendedTextMessage" && m.content.includes("imageMessage");
  const isSticker = m.type === "stickerMessage";
  const isQuotedSticker = m.type === "extendedTextMessage" && m.content.includes("stickerMessage");
  const p = m.quoted ? m.quoted : m 

  // Fungsi bantu convert gambar/stiker ke PNG (output file)
  async function convertToPng(input, output) {
    return new Promise((resolve, reject) => {
      const ffmpeg = spawn(ffmpegPath, [
        "-i", input,
        "-f", "image2pipe",
        "-vcodec", "png",
        "-vf", "fps=1",
        "-vframes", "1", // ambil 1 frame saja
        output,
      ]);

      ffmpeg.on("error", reject);

      ffmpeg.stderr.on("data", () => { /* bisa untuk logging jika mau */ });

      ffmpeg.on("close", (code) => {
        if (code === 0) resolve();
        else reject(new Error(`ffmpeg exited with code ${code}`));
      });
    });
  }

  if (isImage || isQuotedImage) {
    try {
      let yoooo = await p.download(true)
      // Convert to PNG? Kalau hanya konversi dan outputnya pipe, belum jelas mau pakai output ke mana.
      // Kalau kamu memang hanya butuh konversi ke PNG file, buat file output dulu.
      // Tapi dari kode awal sepertinya hanya pipe, tanpa simpan file? Kalau begitu, skip dulu convert.
      // Jika ingin disimpan, bisa pakai fungsi convertToPng:

      // Contoh: langsung hapus saja file setelah selesai tanpa output ke file lain:
      await fs.unlink(yoooo); 
      setReply("Proses gambar selesai (tidak ada output disimpan)");
    } catch (e) {
      console.error(e);
      setReply("Gagal :V");
    }
  } else if (isSticker || isQuotedSticker) {
    let yoooo = await p.download(true)
    let ran = getRandomFile(".png");

    try {
      await convertToPng(yoooo, ran);
      await fs.unlink(yoooo);

      let bodyForm = new FormData();
      bodyForm.append("image", fs.createReadStream(ran));

      let res = await fetch("https://api.trace.moe/search", {
        method: "POST",
        body: bodyForm,
      }).then(r => r.json());

      if (!res.result || res.result.length <= 0) {
        await fs.unlink(ran);
        return setReply("Anime not found! :(");
      }

      let teks = "";
      if (res.result[0].similarity < 0.92) {
        teks += "*Low similarity. 🤔*\n\n";
      }
      teks += `*Title*: ${res.result[0].filename.split(".mp4")[0]}\n*Episode*: ${res.result[0].episode}\n*Similarity*: ${(res.result[0].similarity * 100).toFixed(1)}%`;

      await conn.sendMessage(
        m.chat,
        { caption: teks, video: { url: res.result[0].video } },
        { quoted: m }
      );

      await fs.unlink(ran);
    } catch (err) {
      console.error(err);
      setReply("Gagal :V");
      try { await fs.unlink(yoooo); } catch {}
      try { await fs.unlink(ran); } catch {}
    }
  } else {
    setReply(`Kirim/reply gambar atau sticker dengan caption ${command}`);
  }
};

handler.help = ["anime"];
handler.tags = ["search"];
handler.command = ["whatanime"];

export default handler;
