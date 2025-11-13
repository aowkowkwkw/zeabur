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

const colors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3']

async function createFrames(text, size = 512) {
  const frames = []
  const frameDir = temp('attp_frames_' + Date.now())
  fs.mkdirSync(frameDir)

  const fontSize = text.length < 6 ? 100 : text.length < 12 ? 80 : 60
  const centerY = size / 2 + fontSize * 0.35 // Supaya tidak kepotong atas

  for (let i = 0; i < colors.length; i++) {
    const color = colors[i]
    const svg = `
      <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="none"/>
        <text x="50%" y="${centerY}" font-size="${fontSize}" fill="${color}" font-family="sans-serif" font-weight="bold"
          dominant-baseline="middle" text-anchor="middle">${escapeXML(text)}</text>
      </svg>
    `
    const buffer = await sharp(Buffer.from(svg)).png().toBuffer()
    const filePath = path.join(frameDir, `frame_${String(i).padStart(3, '0')}.png`)
    fs.writeFileSync(filePath, buffer)
    frames.push(filePath)
  }

  return { frames, frameDir }
}

async function generateGif(frames, outputPath) {
  return new Promise((resolve, reject) => {
    const ffmpegArgs = [
      '-y',
      '-framerate', '2',
      '-i', path.join(path.dirname(frames[0]), 'frame_%03d.png'),
      '-filter_complex', '[0:v]palettegen[p];[0:v][p]paletteuse',
      '-loop', '0',
      outputPath
    ]

    const ffmpeg = spawn(ffmpegPath, ffmpegArgs)

   // ffmpeg.stderr.on('data', data => console.log('ffmpeg:', data.toString()))

    ffmpeg.on('exit', (code) => {
      if (code === 0) resolve(outputPath)
      else reject(new Error(`ffmpeg exited with code ${code}`))
    })
  })
}

const handler = async (m, { conn, text }) => {
  if (!text) return m.reply('Teksnya mana? Contoh: .attp halo ganteng 😎')

  try {
    const filename = temp(`attp_${Date.now()}.gif`)
    const { frames, frameDir } = await createFrames(text)
    await generateGif(frames, filename)

  await conn.toSticker(m.chat, filename, m)


    // Bersihkan
    for (const f of frames) fs.unlinkSync(f)
    //fs.rmdirSync(frameDir)
   // fs.unlinkSync(filename)
  } catch (e) {
    console.error(e)
    return m.reply('Gagal bikin attp. Pastikan ffmpeg-static jalan.')
  }
}

export default handler
handler.command = ['attp']
