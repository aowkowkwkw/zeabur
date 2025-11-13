import fs from 'fs'
import path from 'path'

/**
 * Cek apakah file mengandung 'export default handler'
 * @param {string} filePath 
 * @returns {boolean}
 */
function isPluginActive(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    return /export\s+default\s+handler/.test(content)
  } catch {
    return false
  }
}

/**
 * Cari file yang mengandung keyword di seluruh subfolder
 * @param {string} dir 
 * @param {string} keyword 
 * @returns {{path: string, active: boolean}[]}
 */
function findFileAnywhere(dir, keyword) {
  let results = []
  const list = fs.readdirSync(dir)

  for (let file of list) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      if (file === 'node_modules' || file === global.session || file.startsWith('.')) continue
      results = results.concat(findFileAnywhere(filePath, keyword))
    } else {
      if (file.toLowerCase().includes(keyword.toLowerCase())) {
        results.push({
          path: filePath.replace(/\\/g, '/'),
          active: isPluginActive(filePath)
        })
      }
    }
  }

  return results
}

/**
 * Handler utama
 */
let handler = async (m, { text, command,setReply }) => {
  if (!text) return m.reply(`Kirim nama file atau kata kunci\nContoh: *.${command} owner*`)

  let keyword = text.toLowerCase()
  let files = findFileAnywhere('.', keyword)

  if (!files.length) return m.reply(`❌ Tidak ditemukan file yang mengandung kata *${text}*.`)

  let hasil = files.map((f, i) => {
    let status = f.active ? '🧩 Aktif' : '💤 Pasif'
    return `${i + 1}. ${f.path}`
  }).join('\n')

  let res = `

  
╭━━〔🔍 FIND FILE SCANNER〕━━╮
│ 📌 Kata kunci: *${text}*
│ 📁 Total ditemukan: *${files.length}*
╰━━━━━━━━━━━━━━━━━━━━━━━╯

${hasil}

 
`.trim()

  setReply(res)
}


handler.help = ['findfile <keyword>']
handler.tags = ['tools']
handler.command = /^findfile|ff$/i

export default handler
