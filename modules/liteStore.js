import { LRUCache } from 'lru-cache'

export class MessageStore {
  constructor(ttl = 3 * 60 * 1000, maxPerJid = 100, maxJids = 100) {
    this.ttl = ttl
    this.maxPerJid = maxPerJid
    this.maxJids = maxJids

    // LRU untuk JID
    this.messagesByJid = new LRUCache({
      max: maxJids,
      ttl: ttl,
      dispose: (store, jid) => store.clear?.(), // bersihkan memory tiap JID
    })
  }

  add(messages) {
    const now = Date.now()

    for (const msg of messages) {
      if (!msg || !msg.message || !msg.key?.remoteJid || !msg.key?.id) continue

      const jid = msg.key.remoteJid
      const id = msg.key.id

      if (!this.messagesByJid.has(jid)) {
        this.messagesByJid.set(jid, new LRUCache({
          max: this.maxPerJid,
          ttl: this.ttl,
        }))
      }

      const store = this.messagesByJid.get(jid)

      store.set(id, {
        message: msg.message,
        timestamp: now,
        sender: msg.pushName || msg.participant || null
      })
    }
  }

  getMessage(jid, id) {
    const store = this.messagesByJid.get(jid)
    if (!store) return null
    return store.get(id) || null
  }

  loadMessage(jid, id) {
    const data = this.getMessage(jid, id)
    return data ? { key: { remoteJid: jid, id }, message: data.message } : null
  }

  clear(jid) {
    this.messagesByJid.delete(jid)
  }

  clearAll() {
    this.messagesByJid.clear()
  }

  getStats() {
    return {
      totalJids: this.messagesByJid.size,
      perJid: Array.from(this.messagesByJid.entries()).map(([jid, store]) => ({
        jid,
        count: store.size
      }))
    }
  }
}

const liteStore = new MessageStore()
export default liteStore
