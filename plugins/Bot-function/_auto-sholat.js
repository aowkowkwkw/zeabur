const sholatCache = new Map() // cache untuk menahan reminder per chat+sholat

const sholatIcons = {
  Fajr: "🕌",
  Sunrise: "🌅",
  Dhuhr: "☀️",
  Asr: "🌇",
  Sunset: "🌆",
  Maghrib: "🌃",
  Isha: "🌌",
  Imsak: "🌙",
  Midnight: "🕛",
  Firstthird: "🌘"
}

const sholatDescriptions = {
  Fajr: "Subuh",
  Sunrise: "Matahari terbit",
  Dhuhr: "Dzuhur",
  Asr: "Ashar",
  Sunset: "Matahari terbenam",
  Maghrib: "Maghrib",
  Isha: "Isya",
  Imsak: "Waktu mulai puasa",
  Midnight: "Tengah malam",
  Firstthird: "Sepertiga malam pertama"
}

const jadwalCache = {
  data: null,
  timestamp: 0
}
const CACHE_EXPIRE = 1000 * 60 * 15 // 15 menit

async function getJadwalSholat() {
  const now = Date.now()
  if (jadwalCache.data && (now - jadwalCache.timestamp) < CACHE_EXPIRE) {
    return jadwalCache.data
  }
  try {
    const response = await fetch("https://api.aladhan.com/v1/timingsByCity?city=Jakarta&country=Indonesia&method=8")
    const json = await response.json()
    const timings = json.data.timings
    jadwalCache.data = timings
    jadwalCache.timestamp = now
    return timings
  } catch (e) {
    console.error('Gagal fetch jadwal sholat:', e)
    // fallback manual kalau API error
    return {
      Fajr: "04:30",
      Sunrise: "05:57",
      Dhuhr: "11:49",
      Asr: "15:03",
      Sunset: "17:54",
      Maghrib: "17:50",
      Isha: "19:00",
      Imsak: "04:30",
      Midnight: "23:55",
      Firstthird: "21:54"
    }
  }
}

export async function before(m) {
  const id = m.chat
  const who = m.mentionedJid?.[0] || (m.fromMe ? this.user.jid : m.sender)
  const displayName = who?.split?.('@')?.[0] || 'user'

  // Cek jika sudah pernah dikirim reminder sholat ini dalam 1 menit untuk chat ini
  if (sholatCache.has(id)) return

  // Ambil jadwal sholat terbaru
  const jadwalSholat = await getJadwalSholat()

  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }))
  const hours = now.getHours()
  const minutes = now.getMinutes()
  const nowMinutes = hours * 60 + minutes

  // Sholat yang mau dikirim reminder (bisa kamu tambahkan/remove)
  const sholatReminderList = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"]

  for (const [sholat, waktu] of Object.entries(jadwalSholat)) {
    if (!sholatReminderList.includes(sholat)) continue

    const [h, m] = waktu.split(":").map(Number)
    const targetMinutes = h * 60 + m
    const diff = Math.abs(nowMinutes - targetMinutes)

    // Kirim reminder jika waktunya +/- 1 menit dari sekarang
    if (diff <= 1) {
      const cacheKey = `${id}-${sholat}`
      if (sholatCache.has(cacheKey)) continue

      const icon = sholatIcons[sholat] || ""
      const desc = sholatDescriptions[sholat] || sholat

      const text = `${icon} *Pengingat Waktu Sholat*\n\nHai kak @${displayName},\nSekedar mengingatkan bahwa sekarang waktu *${sholat}* (${desc}) telah tiba.\nBagi yang beragama Islam, yuk ambil air wudhu dan tunaikan ibadah sholat 😇\n\n🕒 *${waktu}* (Wilayah Jakarta dan sekitarnya)\n\nSemoga harimu penuh berkah dan kedamaian 🤲`

      await this.reply(m.chat, text, null, {
        contextInfo: { mentionedJid: [who] }
      })

      sholatCache.set(cacheKey, true)
      setTimeout(() => sholatCache.delete(cacheKey), 60_000) // hapus cache setelah 1 menit agar bisa kirim ulang jika perlu
      break
    }
  }
}

export const disabled = false
