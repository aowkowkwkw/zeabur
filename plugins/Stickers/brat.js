import sharp from 'sharp'

async function bratImageSVG(text = 'BRAT MODE') {
  const maxChar = 40
  const width = 512
  const height = 512
  const maxFontSize = 90
  const minFontSize = 30

  if (text.length > maxChar) text = text.slice(0, maxChar) + '...'

  // coba-coba dari besar ke kecil
  let bestSVG = ''
  for (let fontSize = maxFontSize; fontSize >= minFontSize; fontSize -= 2) {
    const lineHeight = fontSize * 1.2
    const maxLineChar = Math.floor(width / (fontSize * 0.6)) // estimasi lebar per huruf
    const lines = wrapText(text, maxLineChar)

    // total tinggi teks
    const totalHeight = lines.length * lineHeight
    if (totalHeight > height - 20) continue // terlalu tinggi, coba font lebih kecil

    const svgText = lines
      .map((line, i) => {
        const y = height / 2 - ((lines.length - 1) * lineHeight) / 2 + i * lineHeight
        return `<text x="50%" y="${y}" font-size="${fontSize}" fill="black" font-family="sans-serif" font-weight="bold" text-anchor="middle" dominant-baseline="middle">${escapeXML(line)}</text>`
      })
      .join('\n')

    bestSVG = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="white"/>
        ${svgText}
      </svg>
    `
    break // pertama yang cocok langsung pakai
  }

  if (!bestSVG) throw 'Teks terlalu panjang untuk ditampilkan.'

  return await sharp(Buffer.from(bestSVG)).png().toBuffer()
}

function wrapText(text, maxLength) {
  const words = text.split(' ')
  const lines = []
  let line = ''
  for (const word of words) {
    if ((line + ' ' + word).trim().length <= maxLength) {
      line += (line ? ' ' : '') + word
    } else {
      lines.push(line)
      line = word
    }
  }
  if (line) lines.push(line)
  return lines
}

function escapeXML(str = '') {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

const handler = async (m, { text, conn }) => {
  if (!text) return m.reply('Tulisannya mana? Contoh: .brat aku paling sangar 😎')

  try {
    const buffer = await bratImageSVG(text)
      conn.toSticker(m.chat,buffer,m)
  //  await conn.sendFile(m.chat, buffer, 'brat.png', '', m, false, { asSticker: true })
  } catch (e) {
    console.error(e)
    m.reply('Gagal membuat stiker, kemungkinan teksnya terlalu panjang 🥲')
  }
}

export default handler
handler.command = ['brat']
