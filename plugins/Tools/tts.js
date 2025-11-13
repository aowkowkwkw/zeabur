let handler = async (m, { args, setReply, prefix, command }) => {
  if (!args.length) return setReply(`Contoh penggunaan:\n${prefix}${command} id halo dunia`)

  async function tts(text, lang = "id") {
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=tw-ob`

    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    })
    if (!res.ok) throw new Error(`Gagal mengambil suara: ${res.statusText}`)

    const arrayBuffer = await res.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    return buffer
  }

  const defaultLang = "id"
  let lang = args[0]
  let text = args.slice(1).join(" ")

  if (!lang || lang.length !== 2) {
    lang = defaultLang
    text = args.join(" ")
  }

  if (!text && m.quoted?.text) text = m.quoted.text
  if (!text) return setReply(`Teks tidak boleh kosong.\nContoh penggunaan:\n${prefix}${command} en hello world`)

  try {
    const audioBuffer = await tts(text, lang)
   await conn.sendFile(m.chat, audioBuffer, "voice.mp3", "", m,true);

  } catch (err) {
    console.error(err)
    setReply(`Terjadi kesalahan saat mengonversi teks ke suara:\n${err.message}`)
  }
}

handler.help = ["tts"]
handler.tags = ["tools"]
handler.command = ["tts"]

export default handler
