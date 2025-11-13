import fs from "fs-extra";
import { spawn } from "child_process";
import ffmpegPath from "ffmpeg-static";

let handler = async (m, { conn, setReply }) => {
  const isVideo = m.type === "videoMessage";
  const isQuotedVideo =
    m.type === "extendedTextMessage" && m.content.includes("videoMessage");
  const p = m.quoted ? m.quoted : m 

  if (!(isQuotedVideo || isVideo)) {
    return setReply("Reply videonya");
  }

  setReply(mess.wait);

  try {
    let media = await p.download(true)
    let ran = getRandomFile(".mp3");

    // Spawn ffmpeg process
    const ffmpeg = spawn(ffmpegPath, [
      "-i", media,
      "-vn", // remove video
      "-acodec", "libmp3lame",
      ran
    ]);

    ffmpeg.on("error", (err) => {
      console.error(err);
      fs.unlinkSync(media);
      if (fs.existsSync(ran)) fs.unlinkSync(ran);
      setReply(`Err: ${err.message || err}`);
    });

    ffmpeg.on("close", async (code) => {
      if (code !== 0) {
        fs.unlinkSync(media);
        if (fs.existsSync(ran)) fs.unlinkSync(ran);
        return setReply(`FFmpeg exited with code ${code}`);
      }
      let buffer = fs.readFileSync(ran);
      await conn.sendMessage(
        m.chat,
        { mimetype: "audio/mp4", audio: buffer },
        { quoted: m }
      );
      fs.unlinkSync(media);
      fs.unlinkSync(ran);
    });
  } catch (err) {
    setReply(`Error: ${err.message || "Terjadi kesalahan saat memproses video."}`);
  }
};

handler.help = ["converter"];
handler.tags = ["internet"];
handler.command = ["tomp3"];

export default handler;
