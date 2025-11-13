import fs from "fs-extra";
import path from "path";
import { spawn } from "child_process";
import ffmpegPath from "ffmpeg-static";


function convertToMp3(input, output) {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn(ffmpegPath, [
      "-y",            // overwrite output file if exists
      "-i", input,     // input file
      "-vn",           // no video
      "-acodec", "libmp3lame", // audio codec mp3
      output,
    ]);

    ffmpeg.on("error", reject);

    ffmpeg.stderr.on("data", data => {
      // Optional: bisa log progress di sini jika mau
      // console.log(`ffmpeg stderr: ${data}`);
    });

    ffmpeg.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited with code ${code}`));
    });
  });
}

let handler = async (m, { conn, q, args, command, setReply }) => {
  const isQuotedVideo =
    m.type === "extendedTextMessage" && m.content.includes("videoMessage");
  const isQuotedAudio =
    m.type === "extendedTextMessage" && m.content.includes("audioMessage");
  const isVideo = m.type === "videoMessage";
  const p = m.quoted ? m.quoted : m 

  if (isVideo || isQuotedVideo || isQuotedAudio) {

const acrcloud = require("acrcloud");

const acr = new acrcloud({
  host: "identify-eu-west-1.acrcloud.com",
  access_key: "c9f2fca5e16a7986b0a6c8ff70ed0a06",
  access_secret: "PQR9E04ZD60wQPgTSRRqwkBFIWEZldj0G3q7NJuR",
});



    setReply(mess.wait);
    try {
      let media = await p.download(true)
      let ran = getRandomFile(".mp3");

      await convertToMp3(media, ran);
      await fs.unlink(media);

      let sample = await fs.readFile(ran);
      let metadata = await acr.identify(sample);

      if (metadata.status.msg === "No result") {
        await fs.unlink(ran);
        return setReply("Music tidak ditemukan");
      }

      let res = metadata.metadata.music[0];
      let text = `
Judul: ${res.title}
Durasi: ${conn.msToMinute(res.duration_ms)}
Artis: ${res.artists[0].name}
Release: ${res.release_date}
Label: ${res.label}
`;
      setReply(text);
      await fs.unlink(ran);
    } catch (err) {
      console.error(err);
      setReply("Gagal mengkonversi atau memproses audio");
    }
  } else {
    setReply("Reply audio atau video");
  }
};

handler.help = ["pinterest"];
handler.tags = ["info"];
handler.command = ['wmusic','whatmusic'];
export default handler;
