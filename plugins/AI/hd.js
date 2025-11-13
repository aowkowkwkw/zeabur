import axios from 'axios'
import FormData from 'form-data'

async function ihancer(buffer, {
    method = 1,
    size = 'low'
} = {}) {
    const _size = ['low', 'medium', 'high']

    if (!buffer || !Buffer.isBuffer(buffer)) throw new Error('Image buffer is required')
    if (method < 1 || method > 4) throw new Error('Available methods: 1, 2, 3, 4')
    if (!_size.includes(size)) throw new Error(`Available sizes: ${_size.join(', ')}`)

    const form = new FormData()
    form.append('method', method.toString())
    form.append('is_pro_version', 'false')
    form.append('is_enhancing_more', 'false')
    form.append('max_image_size', size)
    form.append('file', buffer, `rynn_${Date.now()}.jpg`)

    const { data } = await axios.post('https://ihancer.com/api/enhance', form, {
        headers: {
            ...form.getHeaders(),
            'accept-encoding': 'gzip',
            'host': 'ihancer.com',
            'user-agent': 'Dart/3.5 (dart:io)'
        },
        responseType: 'arraybuffer'
    })

    return Buffer.from(data)
}

let handler = async (m, { conn, args }) => {
    try {
        const q = m.quoted ? m.quoted : m
        const mime = (q.msg || q).mimetype || ''

        if (!mime.startsWith('image/')) {
            return m.reply(
                'Kirim atau reply gambar dengan caption:\n\n' +
                'Method : 1, 2, 3, 4\n' +
                'Size : low, medium, high\n\n' +
                '*Example :* .hd 2 high'
            )
        }

        m.reply('Wait...')

        const buffer = await q.download()
        const method = args[0] ? parseInt(args[0]) : 1
        const size = args[1] || 'low'

        const enhanced = await ihancer(buffer, { method, size })

        const text = `✅ Image Enhanced Successfully
Method : ${method}
Size : ${size}
Original Size : ${(buffer.length / 1024).toFixed(2)} KB
Enhanced Size : ${(enhanced.length / 1024).toFixed(2)} KB`

        await conn.sendMessage(m.chat, {
            image: enhanced,
            caption: text
        }, { quoted: m })

    } catch (e) {
        m.reply(`❌ Error: ${e.message}`)
    }
}

handler.help = ['hd']
handler.command = ['hd','hdr']
handler.tags = ['tools']

export default handler
