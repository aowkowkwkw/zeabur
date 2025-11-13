 import fs from "fs-extra"
import path from "path"

const isImage = (format) => ["jpg", "jpeg", "png"].includes(format)
const isVideo = (format) => ["mp4", "mov", "avi"].includes(format)
const isTextFormat = (format) => ["js", "json", "txt"].includes(format)

const getMimetype = (format) =>
  format === "js"
    ? "text/javascript"
    : format === "json"
    ? "application/json"
    : "application/octet-stream"

const isSafePath = (teks) => !teks.includes("..") && !path.isAbsolute(teks)

const sleep = (ms) => new Promise((res) => setTimeout(res, ms))

// Fungsi pencarian file rekursif
async function findFileRecursive(targetName, dir = ".", ignoreFolders = []) {
  const result = []

  async function traverse(currentDir) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true }).catch(() => [])

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name)
      const relPath = path.relative(".", fullPath)
      if (ignoreFolders.some((f) => relPath.startsWith(f))) continue

      if (entry.isDirectory()) {
        await traverse(fullPath)
      } else if (entry.isFile() && entry.name === targetName) {
        result.push(relPath)
      }
    }
  }

  await traverse(dir)
  return result
}

// Main handler
let handler = async (m, { q, conn, setReply }) => {
  if (!q) return setReply("Contoh: getfile config.js atau getfile handler.js-text")

  let text = q.endsWith("-text")
  let teks = q.replace("-text", "").trim()
  let format = teks.split(".").pop()

  if (!format) return setReply("Tipe file tidak diketahui (js/json/mp4/dll)")
  if (!isSafePath(teks)) return setReply("Path tidak valid.")

  const mimetype = getMimetype(format)
  const jpegThumbnail = fs.readFileSync("./media/thumbnaildokumen.jpg")
  const ignoredFolders = ["node_modules", ".git", ".cache", "session", ".lesson"]

  setReply("Mencari file...")
  await sleep(1000)

  const files = await findFileRecursive(teks, ".", ignoredFolders)

  if (files.length === 0) return setReply("File tidak ditemukan.")

  if (files.length === 1) {
    await sendFile(files[0], format, text, m, conn, mimetype, jpegThumbnail)
    return
  }

  // Simpan pilihan user
  global._fileSelect = global._fileSelect || {}
  global._fileSelect[m.sender] = {
    files,
    format,
    text,
    mimetype,
    jpegThumbnail,
    timeout: setTimeout(() => delete global._fileSelect[m.sender], 60 * 1000),
  }

  const list = files.map((f, i) => `${i + 1}. ${f}`).join("\n")
  return setReply(
    `Ditemukan beberapa file:\n\n${list}\n\nBalas dengan angka (1-${files.length}) untuk memilih.`
  )
}

// Fungsi kirim file
async function sendFile(filePath, format, asText, m, conn, mimetype, jpegThumbnail) {
  const file = await fs.readFile(filePath)

  if (isImage(format)) {
    return conn.sendMessage(m.chat, { image: file }, { quoted: m })
  } else if (isVideo(format)) {
    return conn.sendMessage(m.chat, { video: file }, { quoted: m })
  } else if (asText && isTextFormat(format)) {
    return m.reply(file.toString())
  } else {
    return conn.sendMessage(
      m.chat,
      {
        document: file,
        fileName: path.basename(filePath),
        mimetype,
        jpegThumbnail,
      },
      { quoted: m }
    )
  }
}

// Untuk balasan angka setelah list file
let handlerReply = async (m, { conn }) => {
  if (!global._fileSelect || !global._fileSelect[m.sender]) return
  const selected = parseInt(m.text.trim())

  if (isNaN(selected)) return
  const ctx = global._fileSelect[m.sender]
  if (selected < 1 || selected > ctx.files.length) {
    return m.reply(`Nomor tidak valid. Pilih antara 1 - ${ctx.files.length}`)
  }

  clearTimeout(ctx.timeout)
  delete global._fileSelect[m.sender]

  await sendFile(
    ctx.files[selected - 1],
    ctx.format,
    ctx.text,
    m,
    conn,
    ctx.mimetype,
    ctx.jpegThumbnail
  )
}

handler.help = ["getfile"]
handler.tags = ["tools"]
handler.command = /^(getfile|gfi)$/i
handler.owner = true

export default handler
export { handlerReply }
