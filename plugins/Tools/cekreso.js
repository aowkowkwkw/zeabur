 import fs from "fs-extra";
import { spawn } from "child_process";
import ffmpegPath from "ffmpeg-static";
import sharp from "sharp";

let handler = async (m, { q, conn, args, prefix, setReply, command }) => {
  const isImage = m.type === "imageMessage";
  const isQuotedImage = m.type === "extendedTextMessage" && m.content.includes("imageMessage");
  const isVideo = m.type === "videoMessage";
  const isQuotedVideo = m.type === "extendedTextMessage" && m.content.includes("videoMessage");
  const p = m.quoted ? m.quoted : m 

  if (isQuotedImage || isImage) {
    setReply(mess.wait);
    try {
      const media = await p.download(true)
      const metadata = await sharp(media).metadata();
      m.reply(`Resolusi gambar: ${metadata.width} x ${metadata.height}`);
      if (fs.existsSync(media)) fs.unlinkSync(media);
    } catch (err) {
      m.reply("Gagal membaca metadata gambar.");
      console.error("Gagal membaca metadata gambar:", err.message);
    }
  } else if (isQuotedVideo || isVideo) {
    setReply(mess.wait);
    try {
      const media = await p.download(true)
      const ffprobeArgs = [
        "-v", "error",
        "-show_entries", "stream=width,height,codec_type",
        "-show_format",
        "-print_format", "json",
        media
      ];

      const ffprobe = spawn(ffmpegPath.replace("ffmpeg", "ffprobe"), ffprobeArgs);

      let output = "";
      let errorOutput = "";

      ffprobe.stdout.on("data", (data) => {
        output += data.toString();
      });

      ffprobe.stderr.on("data", (data) => {
        errorOutput += data.toString();
      });

      ffprobe.on("close", (code) => {
        if (code !== 0) {
          m.reply("Gagal membaca metadata video.");
          console.error("FFprobe error:", errorOutput);
          if (fs.existsSync(media)) fs.unlinkSync(media);
          return;
        }

        try {
          const metadata = JSON.parse(output);
          const videoStream = metadata.streams.find(s => s.codec_type === "video");
          if (videoStream) {
            const width = videoStream.width || "unknown";
            const height = videoStream.height || "unknown";
            const duration = metadata.format.duration ? parseFloat(metadata.format.duration).toFixed(2) : "unknown";
            m.reply(`Resolusi: ${width} x ${height}\nDurasi: ${duration} detik`);
          } else {
            m.reply("Stream video tidak ditemukan.");
            console.log("Stream video tidak ditemukan.");
          }
        } catch (err) {
          m.reply("Gagal parsing metadata video.");
          console.error("Error parsing ffprobe output:", err.message);
        } finally {
          if (fs.existsSync(media)) fs.unlinkSync(media);
        }
      });
    } catch (err) {
      m.reply("Gagal membaca metadata video.");
      console.error("Gagal membaca metadata video:", err.message);
    }
  } else {
    setReply("Reply Image/vidionya");
  }
};

handler.help = ["tools"];
handler.tags = ["tools"];
handler.command = ["cekreso", "cekresolusi", "cekresoimg"];

export default handler;
