import { LRUCache } from 'lru-cache'
import chalk from '../modules/chalk.js';

// Konfigurasi global
const ENABLE_LOG = true
const EXTRA_DETAIL_LOG = true // Tampilkan detail metadata

function logMessage(msg) {
  if (ENABLE_LOG) console.log(msg)
}

function timeNow() {
  const d = new Date()
  return chalk.gray(d.toLocaleTimeString('id-ID') + '.' + d.getMilliseconds().toString().padStart(3, '0'))
}

// Cache dengan TTL 10 detik
const cache = new LRUCache({
  max: 1000,
  ttl: 10_000
})

/**
 * Cegah pemrosesan ID yang sama berulang kali dalam periode TTL
 * @param {string} id - ID unik pesan/event
 * @param {string} [label='global'] - Label asal pemanggilan
 * @param {any} [meta] - Data tambahan opsional untuk disimpan
 * @returns {boolean} - true jika duplikat, false jika baru
 */
export function antiDouble(id, label = 'global', meta = null) {
  if (!id) return true

  if (cache.has(id)) {
    const data = cache.get(id)
    logMessage(`${chalk.yellow(`[⚠️   DUPLIKAT][${label}]`)} ID: ${id}${EXTRA_DETAIL_LOG && data ? ` | From: ${data.label} | Time: ${new Date(data.time).toLocaleTimeString('id-ID')}` : ''}`)
    return true
  }

  const info = {
    time: Date.now(),
    label,
    meta
  }

  cache.set(id, info)

 // logMessage(`${chalk.green(`[✅ NEW][${label}]`)} ID: ${id}${EXTRA_DETAIL_LOG && meta ? ` | Meta: ${JSON.stringify(meta)}` : ''}`)
  return false
}
