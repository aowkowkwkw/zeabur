import sharp from 'sharp'
import fs from 'fs'
import { spawn } from 'child_process'
import path from 'path'
import os from 'os'
import ffmpegPath from 'ffmpeg-static'

const temp = (name) => path.join(os.tmpdir(), name)

function escapeXML(str = '') {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

async function createFrames(text, size = 512) {
  const frames = []
  const frameDir = temp('brat_frames_' + Date.now())
  fs.mkdirSync(frameDir)

  const words = text.trim().split(/\s+/)

  const marginLeft = 20
  const marginTop = 60  // naikin jarak atas supaya teks turun
  const availableHeight = size - marginTop * 2

  const maxFontSize = Math.floor(availableHeight / (1.2 * words.length))
  const fontSize = Math.min(maxFontSize, 80)
  const lineHeight = fontSize * 1.2

  for (let i = 1; i <= words.length; i++) {
    const partialWords = words.slice(0, i)
    const startY = marginTop + 5  // tambah offset 5px biar makin turun

    const textLines = partialWords.map((w, idx) => {
      return `<text x="${marginLeft}" y="${startY + idx * lineHeight}" font-size="${fontSize}" fill="black" font-family="sans-serif" font-weight="bold" dominant-baseline="hanging" text-anchor="start">${escapeXML(w)}</text>`
    }).join('\n')

    const svg = `
      <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="white"/>
        ${textLines}
      </svg>
    `
    const buffer = await sharp(Buffer.from(svg)).png().toBuffer()
    const filePath = path.join(frameDir, `frame_${String(i).padStart(3, '0')}.png`)
    fs.writeFileSync(filePath, buffer)
    frames.push(filePath)
  }

  return { frames, frameDir }
}



async function generateVideo(frames, outputPath) {
  return new Promise((resolve, reject) => {
    const ffmpegArgs = [
      '-y',
      '-framerate', '2', // 2 fps = 500 ms per frame
      '-i', path.join(path.dirname(frames[0]), 'frame_%03d.png'),
      '-vf', 'pad=ceil(iw/2)*2:ceil(ih/2)*2',
      '-c:v', 'libx264',
      '-pix_fmt', 'yuv420p',
      outputPath
    ]

    const ffmpeg = spawn(ffmpegPath, ffmpegArgs)

    ffmpeg.stderr.on('data', (data) => {
      // console.error(data.toString()) // uncomment untuk debugging
    })

    ffmpeg.on('exit', (code) => {
      if (code === 0) resolve(outputPath)
      else reject(new Error('FFmpeg exited with code ' + code))
    })
  })
}

const handler = async (m, { text, conn }) => {
  if (!text) return m.reply('Tulisannya mana? Contoh: .bratvid halo bang')

  const maxChar = 60
  if (text.length > maxChar) text = text.slice(0, maxChar) + '...'

  const filename = temp(`brat_${Date.now()}.mp4`)
  try {
    const { frames, frameDir } = await createFrames(text)
    await generateVideo(frames, filename)
    await conn.toSticker(m.chat, filename, m)
    // Hapus file frame
    for (const file of frames) fs.unlinkSync(file)
    // fs.rmdirSync(frameDir) // uncomment kalau mau hapus folder juga
    // fs.unlinkSync(filename) // hapus video setelah dikirim jika perlu
  } catch (e) {
    console.error(e)
    m.reply('Gagal membuat video. Pastikan ffmpeg-static bekerja 🙏')
  }
}

export default handler
handler.command = ['bratvid']
