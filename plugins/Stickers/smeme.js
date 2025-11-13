import fs from "fs-extra";
import path from "path";
import { spawn } from "child_process";
import ffmpegPath from "ffmpeg-static";

const { tmpFile } = await import(`../../lib/uploader.js`).catch(console.log);

let tempFiles = [];

let handler = async (m, { q, conn, setReply, prefix }) => {
  const isImage = m.type === "imageMessage";
  const isQuotedImage = m.type === "extendedTextMessage" && m.content.includes("imageMessage");
  const isQuotedSticker = m.type === "extendedTextMessage" && m.content.includes("stickerMessage");
  const p = m.quoted ? m.quoted : m

  if (!q) return setReply(`Masukkan teks, contoh: ${prefix}smeme teks atas|teks bawah`);
  setReply(mess.wait);

  let [topRaw, bottomRaw] = q.split("|");
  let top = encodeURIComponent(topRaw?.trim() || "");
  let bottom = encodeURIComponent(bottomRaw?.trim() || "");
  if (top.length > 100 || bottom.length > 100) return setReply("Teks terlalu panjang bro! Batas 100 karakter per baris.");

  try {
    if (isQuotedSticker) {
      let inputPath = await p.download(true)
      tempFiles.push(inputPath);

      let outputPath = getRandomFile(".png");
      tempFiles.push(outputPath);

      await convertWebpToPng(inputPath, outputPath);

      const buffer = await fs.readFile(outputPath);
      const uploaded = await tmpFile(buffer);
      const memeUrl = `https://api.memegen.link/images/custom/${top}/${bottom}.png?background=${uploaded}`;

  
      await conn.toSticker(m.chat, memeUrl, m);
    } else if (isQuotedImage || isImage) {
      let filePath = await p.download(true)
      tempFiles.push(filePath);

      const buffer = await fs.readFile(filePath);
      const uploaded = await tmpFile(buffer);
      const memeUrl = `https://api.memegen.link/images/custom/${top}/${bottom}.png?background=${uploaded}`;

   
      await conn.toSticker(m.chat, memeUrl, m);
    } else {
      return setReply("Balas dengan stiker atau gambar!");
    }
  } catch (err) {
    console.error(err);
    setReply("Gagal memproses media!");
  } finally {
    safeUnlinkAll();
  }
};

// Konversi WebP ke PNG menggunakan ffmpeg-static + child_process
async function convertWebpToPng(input, output) {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn(ffmpegPath, [
      "-i",
      input,
      "-f",
      "png",
      "-y",
      output,
    ]);

    ffmpeg.on("error", (err) => {
      reject(err);
    });

    ffmpeg.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited with code ${code}`));
    });
  });
}

function safeUnlinkAll() {
  tempFiles.forEach((file) => {
    try {
      if (fs.existsSync(file)) fs.unlinkSync(file);
    } catch (e) {
      console.error("Gagal hapus file temp:", file, e);
    }
  });
  tempFiles = [];
}

handler.help = ["smeme"];
handler.tags = ["tools"];
handler.command = ["smeme"];

export default handler;
