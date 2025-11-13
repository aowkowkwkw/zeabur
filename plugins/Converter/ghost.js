import fs from "fs-extra";
import { spawn } from "child_process";
import ffmpegPath from "ffmpeg-static";

// Helper untuk bikin random id (5 karakter alphanumeric)
function makeid(length = 5) {
    let result = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Helper random file name dengan ekstensi
function getRandomFile(ext = ".mp3") {
    return `/tmp/${makeid(8)}${ext}`;
}

let handler = async (m, { conn, setReply }) => {
    const isQuotedAudio = m.type === "extendedTextMessage" && m.content.includes("audioMessage");
    const p = m.quoted ? m.quoted : m 

    if (!isQuotedAudio) {
        return setReply("Reply audionya");
    }

    setReply("Tunggu sebentar...");

    try {
        const inputPath = await p.download(true) ;
        const outputPath = getRandomFile(".mp3");

        // Build argumen ffmpeg untuk filter audio
        // Contoh filter kamu: atempo=1.6,asetrate=3486
        const args = [
            "-i", inputPath,
            "-af", "atempo=1.6,asetrate=3486",
            "-y", // overwrite output
            outputPath
        ];

        const ffmpeg = spawn(ffmpegPath, args);

        ffmpeg.stderr.on("data", data => {
            // Bisa debug log ffmpeg kalau mau
            // console.log(`ffmpeg stderr: ${data}`);
        });

        ffmpeg.on("close", async (code) => {
            if (code === 0) {
                try {
                    await fs.unlink(inputPath);
                    const buffer = await fs.readFile(outputPath);
                    await conn.sendMessage(m.chat, { mimetype: "audio/mp4", ptt: true, audio: buffer }, { quoted: m });
                    await fs.unlink(outputPath);
                } catch (err) {
                    setReply(`Error saat mengirim audio: ${err.message}`);
                }
            } else {
                await fs.unlink(inputPath).catch(() => {});
                await fs.unlink(outputPath).catch(() => {});
                setReply(`Gagal mengonversi audio, ffmpeg exit code: ${code}`);
            }
        });

    } catch (err) {
        setReply(`Error: ${err.message || "Terjadi kesalahan saat mengunduh atau mengonversi audio."}`);
    }
};

handler.help = ["converter"];
handler.tags = ["internet"];
handler.command = ["ghost"];

export default handler;
