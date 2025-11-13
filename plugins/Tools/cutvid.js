import fs from "fs-extra";
import path from "path";
import { spawn } from "child_process";
import ffmpegPath from "ffmpeg-static";

let handler = async (m, { conn, q, args, setReply, mess, prefix, command }) => {
  const p = m.quoted ? m.quoted : m
  const isVideo = m.type === "videoMessage";
  const isQuotedVideo =
    m.type === "extendedTextMessage" && m.content.includes("videoMessage");

  if (!(isVideo || isQuotedVideo)) return setReply("Reply videonya!");

  const durationOriginal = p.seconds || 0;
  const inputPath = await p.download(true)
  const outputPath = path.join("./", `cut-${Date.now()}.mp4`);

  let start = 0;
  let duration = 0;

  if (args.length === 1 && !isNaN(parseInt(args[0]))) {
    duration = parseInt(args[0]);
    if (duration > durationOriginal)
      return setReply(`Durasi melebihi panjang video (${durationOriginal} detik)`);
  } else if (args.length === 2 && !isNaN(args[0]) && !isNaN(args[1])) {
    start = parseInt(args[0]);
    const end = parseInt(args[1]);
    if (end <= start)
      return setReply("End harus lebih besar dari start!");
    duration = end - start;
    if (end > durationOriginal)
      return setReply(`Durasi akhir melebihi durasi video (${durationOriginal} detik)`);
  } else {
    return setReply(`Format salah!\nContoh:\n• ${prefix + command} 15\n• ${prefix + command} 10 20`);
  }

  setReply(mess.wait);

  const argsFFmpeg = [
    "-ss", start.toString(),
    "-i", inputPath,
    "-t", duration.toString(),
    "-c", "copy",
    outputPath
  ];

  const ff = spawn(ffmpegPath, argsFFmpeg);

  ff.on("error", (err) => {
    if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    setReply(`FFmpeg error: ${err.message}`);
  });

  ff.on("close", async (code) => {
    if (code !== 0) {
      if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
      return setReply(`FFmpeg exited with code ${code}`);
    }

    try {
      await conn.sendMessage(
        m.chat,
        {
          video: fs.createReadStream(outputPath),
          caption: `🎬 Potongan dari detik ${start} selama ${duration} detik`,
          mimetype: "video/mp4",
        },
        { quoted: m }
      );
    } catch (err) {
      setReply(`Gagal kirim video: ${err.message}`);
    } finally {
      if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    }
  });
};

handler.help = ["cut [durasi]", "cut [start] [end]"];
handler.tags = ["tools"];
handler.command = ["cut", "cutvid"];

export default handler;
