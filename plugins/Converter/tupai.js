import fs from "fs-extra";
import { spawn } from "child_process";
import ffmpegPath from "ffmpeg-static";

let handler = async (m, { conn, setReply }) => {
  const isQuotedAudio = m.type === "extendedTextMessage" && m.content.includes("audioMessage");
  const p = m.quoted ? m.quoted : m 

  if (!isQuotedAudio) {
    return setReply('Reply audionya');
  }

  setReply('Tunggu sebentar...');

  try {
    let medoi = await p.download(true)
    let ran = getRandomFile('.mp3');

    const convertAudio = (input, output) =>
      new Promise((resolve, reject) => {
        const ffmpeg = spawn(ffmpegPath, [
          '-i', input,
          '-af', 'atempo=0.8,asetrate=65100',
          '-y',
          output,
        ]);

        ffmpeg.stderr.on('data', () => {}); // bisa diisi log jika perlu

        ffmpeg.on('error', (err) => reject(err));

        ffmpeg.on('close', (code) => {
          if (code === 0) resolve();
          else reject(new Error(`ffmpeg exited with code ${code}`));
        });
      });

    await convertAudio(medoi, ran);

    fs.unlinkSync(medoi);
    let buffer = fs.readFileSync(ran);
    await conn.sendMessage(m.chat, { mimetype: 'audio/mp4', ptt: true, audio: buffer }, { quoted: m });
    fs.unlinkSync(ran);

  } catch (err) {
    try { fs.unlinkSync(medoi); } catch {}
    try { fs.unlinkSync(ran); } catch {}
    setReply(`Err: ${err.message || 'Terjadi kesalahan saat mengunduh atau mengonversi audio.'}`);
  }
};

handler.help = ["converter"];
handler.tags = ["internet"];
handler.command = ["tupai"];

export default handler;
