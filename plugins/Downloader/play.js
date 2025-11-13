import axios from 'axios'
import crypto from 'crypto'
import yts from 'yt-search'

const savetube = {
  api: {
    base: 'https://media.savetube.me/api',
    cdn: '/random-cdn',
    info: '/v2/info',
    download: '/download',
  },
  headers: {
    'accept': '*/*',
    'content-type': 'application/json',
    'origin': 'https://yt.savetube.me',
    'referer': 'https://yt.savetube.me/',
    'user-agent': 'Postify/1.0.0',
  },
  formats: ['144', '240', '360', '480', '720', '1080', 'mp3'],
  crypto: {
    hexToBuffer: hex => Buffer.from(hex.match(/.{1,2}/g).join(''), 'hex'),
    decrypt: async enc => {
      if (!enc) throw new Error('Data terenkripsi tidak tersedia.')
      const secretKey = 'C5D58EF67A7584E4A29F6C35BBC4EB12'
      const data = Buffer.from(enc, 'base64')
      const iv = data.slice(0, 16)
      const content = data.slice(16)
      const key = savetube.crypto.hexToBuffer(secretKey)
      const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv)
      let decrypted = decipher.update(content)
      decrypted = Buffer.concat([decrypted, decipher.final()])
      return JSON.parse(decrypted.toString())
    }
  },
  youtube: url => {
    if (!url) return null
    const patterns = [
      /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
      /youtu\.be\/([a-zA-Z0-9_-]{11})/
    ]
    for (const p of patterns) {
      if (p.test(url)) return url.match(p)[1]
    }
    return null
  },
  request: async (endpoint, data = {}, method = 'post') => {
    const url = `${endpoint.startsWith('http') ? '' : savetube.api.base}${endpoint}`
    const res = await axios({
      method,
      url,
      data: method === 'post' ? data : undefined,
      params: method === 'get' ? data : undefined,
      headers: savetube.headers,
    })
    return { status: true, code: 200, data: res.data }
  },
  getCDN: async () => {
    const res = await savetube.request(savetube.api.cdn, {}, 'get')
    if (!res.status) throw new Error('CDN tidak ditemukan')
    return { status: true, code: 200, data: res.data.cdn }
  },
  download: async (link, format) => {
    if (!link) throw new Error('Link video tidak ditemukan.')
    if (!format || !savetube.formats.includes(format)) {
      throw new Error(`Format tidak valid. Pilih salah satu dari: ${savetube.formats.join(', ')}`)
    }
    const id = savetube.youtube(link)
    if (!id) throw new Error('Link tidak valid')
    const cdnx = await savetube.getCDN()
    const cdn = cdnx.data
    const info = await savetube.request(`https://${cdn}${savetube.api.info}`, {
      url: `https://www.youtube.com/watch?v=${id}`
    })
    if (!info?.data?.data) throw new Error('Gagal mengambil data dari SaveTube.')
    const decrypted = await savetube.crypto.decrypt(info.data.data)
    const dl = await savetube.request(`https://${cdn}${savetube.api.download}`, {
      id,
      downloadType: format === 'mp3' ? 'audio' : 'video',
      quality: format === 'mp3' ? '128' : format,
      key: decrypted.key
    })
    return {
      status: true,
      code: 200,
      result: {
        title: decrypted.title || 'Tanpa judul',
        type: format === 'mp3' ? 'audio' : 'video',
        format,
        thumbnail: decrypted.thumbnail || `https://i.ytimg.com/vi/${id}/0.jpg`,
        download: dl.data.data.downloadUrl,
        id,
        key: decrypted.key,
        duration: decrypted.duration,
        quality: format === 'mp3' ? '128' : format,
        downloaded: dl.data.data.downloaded
      }
    }
  }
}




const handler = async (m, { conn, q,text, command, prefix }) => {
  if (!text) return m.reply(`Masukkan judul lagu atau link YouTube.\nContoh: ${prefix + command} lathi weird genius`)
    m.react('🕤')
  let opt = text.endsWith("-doc") ? "doc" : text.endsWith("-mp4") ? "mp4" : "audio"
  let query = text.replace(/-doc|-mp4/gi, "").trim()
  const data = await yts(query)
  const video = data.videos[0]
  const url = video.url
  const dl = await savetube.download(url, opt === "mp4" ? "360" : "mp3")
if(video.timestamp.split(':')[0] > 10) return m.reply('Tidak bisa mendownload audio lebih dari 5 menit')
  const caption = `*Playing now*\n\n💾 *File:*\n• Judul: ${video.title.substr(0, 31) + (video.title.length > 31 ? "..." : "")}\n• Durasi: ${video.timestamp}\n• Ditonton: ${video.views.toLocaleString()} Kali\n• Channel: ${video.author.name || 'Tidak diketahui'}\n\n📮 *Note:*\n• Tambahkan -doc di bagian akhir untuk mengirim file dalam bentuk dokumen\n• Tambahkan -mp4 di bagian akhir untuk mengirim file dalam bentuk video\n\n*Audio sedang dikirim...*`

  await conn.sendMessage(m.chat, {
    text: transformText(caption),
    contextInfo: {
      externalAdReply: {
       // title: transformText(video.title),
        body: transformText(video.author.name )|| "YouTube",
        thumbnailUrl: video.thumbnail,
        mediaUrl: url,
        mediaType: 1,
        renderLargerThumbnail: true,
        sourceUrl: url
      }
    }
  })

  if (opt === "audio") {
    await conn.sendMessage(m.chat, {
      audio: { url: dl.result.download },
      mimetype: 'audio/mp4',
      fileName: `${video.title}.mp3`
    }, { quoted: m })
  } else if (opt === "doc") {
    await conn.sendMessage(m.chat, {
      document: { url: dl.result.download },
      mimetype: 'audio/mp4',
      fileName: `${video.title}.mp3`
    }, { quoted: m })
  } else if (opt === "mp4") {
    await conn.sendMessage(m.chat, {
      video: { url: dl.result.download },
      caption: video.title
    }, { quoted: m })
  }
}

handler.help = ['play']
handler.tags = ['downloader']
handler.command = /^play$/i

export default handler
