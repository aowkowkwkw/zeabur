const {default: makeWASocket,
  proto,
  downloadContentFromMessage,
  getBinaryNodeChild,
  jidDecode,
  areJidsSameUser,
  generateForwardMessageContent,
  generateWAMessageFromContent,
  WAMessageStubType,
  getContentType,
  } = (await import('baileys')).default
  import chalk from '../modules/chalk.js';
  import fs from 'fs-extra'
  import path from'path'
  import moment from '../modules/moment.js'
  import { join, dirname } from 'path'
  import { fileURLToPath, URL } from 'url'
  import { format } from '../modules/util.js'
  import {fileTypeFromFile,fileTypeFromStream,fileTypeFromBuffer} from 'file-type';
  import webp from "node-webpmux"
  import ffmpegPath from 'ffmpeg-static'
  import { spawn } from 'child_process'
  import axios from 'axios'
  import { tmpdir } from 'os'




  export const Socket = (connectionOptions, options = {}) => {
  const conn = makeWASocket(connectionOptions)
  const __dirname = dirname(fileURLToPath(import.meta.url))


  
  //LOAD MESSAGES
  conn.loadMessage = (messageID) => {
  return Object.entries(conn.chats)
  .filter(([_, { messages }]) => typeof messages === 'object')
  .find(([_, { messages }]) => Object.entries(messages)
  .find(([k, v]) => (k === messageID || v.key?.id === messageID)))
  ?.[1].messages?.[messageID]
  }
  
  
  //SETTING
conn.decodeJid = (jid) => {
  if (!jid) return jid
  if (/:\d+@/gi.test(jid)) {
    const decode = jidDecode(jid)
    if (decode && decode.user && decode.server) {
      return decode.user + '@' + decode.server
    } else {
      console.warn('Gagal decode jid:', jid)
      return jid
    }
  }
  return jid
}

  
    
  if (conn.user?.id) conn.user.jid = conn.decodeJid(conn.user.id)


    
// === Penjadwal penulisan dengan debounce ===
function createDebouncedWriter(db, delay = 500) {
  let timeout;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      db.write().catch(console.error);
    }, delay);
  };
}

// === Fungsi pembuat Proxy reactive ===
function createReactiveProxy(conn, field, db, dbKey, delay = 500) {
  const scheduleWrite = createDebouncedWriter(db, delay);

  // Pastikan struktur awal DB aman
  db.data = db.data || {};
  db.data[dbKey] = db.data[dbKey] || {};

  // Pasang Proxy ke field target
  conn[field] = new Proxy({}, {
    set(obj, prop, value) {
      obj[prop] = value;
      db.data[dbKey][prop] = value;
      scheduleWrite();
      return true;
    },
    deleteProperty(obj, prop) {
      delete obj[prop];
      delete db.data[dbKey][prop];
      scheduleWrite();
      return true;
    }
  });

  // Sinkronisasi awal dari DB ke memori
  Object.assign(conn[field], db.data[dbKey]);
}

// === Inisialisasi Proxy untuk contacts dan chats ===
createReactiveProxy(conn, 'contacts', global.dbContacts, 'contacts');
createReactiveProxy(conn, 'chats', global.dbChats, 'chats');


  
  
  //Funtion o geing file
conn.getFile = async (input, save = false) => {
  let data, filename;
  let res;

  switch (true) {
    case Buffer.isBuffer(input):
      data = input;
      break;

    case typeof input === 'string' && /^data:.*?\/.*?;base64,/i.test(input):
      data = Buffer.from(input.split(',')[1], 'base64');
      break;

    case typeof input === 'string' && /^https?:\/\//.test(input):
      res = await fetch(input);
      if (!res.ok) throw new Error(`Fetch failed: ${res.statusText}`);
      const arrayBuffer = await res.arrayBuffer();
      data = Buffer.from(arrayBuffer);
      break;

    case typeof input === 'string' && fs.existsSync(input):
      filename = input;
      data = await fs.promises.readFile(input);
      break;

    case typeof input === 'string':
      data = Buffer.from(input);
      break;

    default:
      data = Buffer.alloc(0);
  }

  if (!Buffer.isBuffer(data)) throw new TypeError('Hasil bukan buffer');

  const type = await fileTypeFromBuffer(data) || {
    mime: 'application/octet-stream',
    ext: 'bin'
  };

  if (save && !filename) {
    filename = path.join(__dirname, '../', `${Date.now()}.${type.ext}`);
    await fs.promises.writeFile(filename, data);
  }

  return {
    res,
    filename,
    ...type,
    data
  };
};

  
  
   


conn.saveName = async (id, name = '') => {
  if (!id) return

  id = conn.decodeJid(id)
  const isGroup = id.endsWith('@g.us')

  const contact = conn.contacts[id] || {}
  const chatData = conn.chats[id] || {}

  let metadata = {}
  if (isGroup && (!contact.subject || !contact.desc)) {
    metadata = await conn.groupMetadata(id).catch(() => ({}))
  }

  const updatedData = {
    ...contact,
    ...(isGroup
      ? {
          subject: metadata.subject || contact.subject || '',
          desc: metadata.desc || contact.desc || ''
        }
      : {
          name: name || contact.name || ''
        })
  }

  if (updatedData.id) updatedData.id = updatedData.id.split('@')[0]

  if (!isGroup) {
    const incomingName = (updatedData.name || '').trim()
    const currentName = (contact.name || '').trim()

    if (!currentName || currentName !== incomingName) {
      conn.contacts[id] = updatedData
    }
  } else {
    const newSubject = (updatedData.subject || '').trim()
    const currentSubject = (contact.subject || '').trim()

    if (!currentSubject || currentSubject !== newSubject) {
      conn.contacts[id] = updatedData
    }
  }
}

  
  
  
  
  

  
  
  
  
  
  
  
  /**
  * Send Contact
  * @param {String} jid
  * @param {String} number
  * @param {String} name
  * @param {Object} quoted
  * @param {Object} options
  */
  conn.sendContact = async (jid, number, name, quoted, options) => {
  let njid = number.replace(new RegExp("[()+-/ +/]", "gi"), "") + `@s.whatsapp.net`
  let vcard = `
  BEGIN:VCARD
  VERSION:3.0
  FN:${name.replace(/\n/g, '\\n')}
  TEL;type=CELL;type=VOICE;waid=${number}:${number}
  END:VCARD
  `
  return await conn.sendMessage(jid, {
  contacts: {
  displayName: `${name}`,
  contacts: [{ vcard }],
  ...options
  }
  },
  {
  quoted,
  ...options
  })
  }
  
  
  
  
  /**
  * Reply to a message
  * @param {String} jid
  * @param {String|Object} text
  * @param {Object} quoted
  * @param {Object} mentions [m.sender]
  */
  conn.reply = (jid, text = '', quoted, options) => {
  return Buffer.isBuffer(text) ? this.sendFile(jid, text, 'file', '', quoted, false, options) : conn.sendMessage(jid, { ...options, text }, { quoted, ...options })
  }
  
  
  
  
  conn.processMessageStubType = async(m) => {
  /**
  * to process MessageStubType
  * @param {import('@adiwajshing/baileys').proto.WebMessageInfo} m
  */
  if (!m.messageStubType) return
  const chat = conn.decodeJid(m.key.remoteJid || m.message?.senderKeyDistributionMessage?.groupId || '')
  if (!chat || chat === 'status@broadcast') return
  const emitGroupUpdate = (update) => {
  ev.emit('groups.update', [{ id: chat, ...update }])
  }
  switch (m.messageStubType) {
  case WAMessageStubType.REVOKE:
  case WAMessageStubType.GROUP_CHANGE_INVITE_LINK:
  emitGroupUpdate({ revoke: m.messageStubParameters[0] })
  break
  case WAMessageStubType.GROUP_CHANGE_ICON:
  emitGroupUpdate({ icon: m.messageStubParameters[0] })
  break
  default: {
  console.log({
  messageStubType: m.messageStubType,
  messageStubParameters: m.messageStubParameters,
  type: WAMessageStubType[m.messageStubType]
  })
  break
  }
  }
  const isGroup = chat.endsWith('@g.us')
  if (!isGroup) return
  let chats = conn.chats[chat]
  if (!chats) chats = conn.chats[chat] = { id: chat }
  chats.isChats = true
  const metadata = await conn.groupMetadata(chat).catch(_ => null)
  if (!metadata) return
  chats.subject = metadata.subject
  chats.metadata = metadata
  }
  
    
  
 

conn.pushMessage = async (m) => {
  if (!m) return
  if (!Array.isArray(m)) m = [m]

  for (const message of m) {
    try {
      if (!message) continue

      if (message.messageStubType && message.messageStubType !== WAMessageStubType.CIPHERTEXT) {
        conn.processMessageStubType(message).catch(console.error)
      }

      const _mtype = Object.keys(message.message || {})
      const mtype = (!['senderKeyDistributionMessage', 'messageContextInfo'].includes(_mtype[0]) && _mtype[0]) ||
        (_mtype.length >= 3 && _mtype[1] !== 'messageContextInfo' && _mtype[1]) ||
        _mtype[_mtype.length - 1]

            const chat = conn.decodeJid(message.key.remoteJid || message.message?.senderKeyDistributionMessage?.groupId || '')
        if (!chat || chat === 'status@broadcast') continue
  
        // -- quotedMessage logic tetap sama --
  
if (conn.chats && Object.keys(conn.chats).length < 1) await conn.insertAllGroup().catch(console.error)
  
        const isGroup = chat.endsWith('@g.us')
        if (!isGroup) continue  // hanya proses grup
        let chats = conn.chats[chat]
        if (!chats && isGroup) await conn.insertAllGroup().catch(console.error)
       
          let metadata, sender
          if ((!chats.subject || !chats.metadata) || (chats.metadata.addressingMode && chats.metadata.addressingMode =='lid') ) {
            metadata = await conn.groupMetadata(chat).catch(() => ({})) || {}
            if (!metadata) continue
            let participants = metadata?.participants || []
            let addressingMode = metadata?.addressingMode
            let lidMode = addressingMode == 'lid'
            let ownerJid = participants.find(p => p.id === metadata.owner)
            let subOwner = participants.find(p => p.id === metadata.subjectOwner)
            
            chats.subject = metadata.subject || ''
            chats.metadata = {
              id: metadata?.id ?? '',
              addressingMode: lidMode? 'lid-update': addressingMode ,
              subject: metadata?.subject ?? '',
              subjectOwner: lidMode? (subOwner?.phone || subOwner?.phoneNumber || subOwner?.jid) : metadata.subjectOwner,
              subjectTime: metadata?.subjectTime ?? 0,
              size: metadata?.size ?? 0,
              creation: metadata?.creation ?? 0,
              owner: lidMode? (ownerJid?.phone || ownerJid?.jid || ownerJid?.phoneNumber ||  metadata.owner) : metadata.owner,
              desc: metadata?.desc,
              descId: metadata?.descId,
              linkedParent: metadata?.linkedParent,
              restrict: !!metadata?.restrict,
              announce: !!metadata?.announce,
              isCommunity: !!metadata?.isCommunity,
              isCommunityAnnounce: !!metadata?.isCommunityAnnounce,
              joinApprovalMode: metadata.joinApprovalMode,
              memberAddMode: metadata.memberAddMode,
              participants: lidMode? participants.map(p => ({lid: p.id, id: p?.jid || p?.phone || p?.phoneNumber ,admin: p.admin})) : participants ,
              ephemeralDuration: metadata?.ephemeralDuration
            }
          }

          sender = conn.decodeJid(message.key?.fromMe && conn.user.id || message.participant || message.key?.participant || chat || '')
  if (['senderKeyDistributionMessage', 'messageContextInfo'].includes(mtype)) continue
        //chats.isChats = true
        if (!chats.messages) chats.messages = {}
 const fromMe = message.key.fromMe || areJidsSameUser(sender || chat, conn.user.id)

 
        if (!['protocolMessage'].includes(mtype) && !fromMe && message.messageStubType !== WAMessageStubType.CIPHERTEXT && message.message) {
          const safeMessage = {
            key: {
              remoteJid: message.key.remoteJid,
              fromMe: message.key.fromMe,
              id: message.key.id,
              ...(message.key.participant ? { participant: message.key.participant } : {})
            },
            message: message.message,
            pushName: message.pushName,
            ...(message.participant ? { participant: message.participant } : {}),
            ...(message.status ? { status: message.status } : {}),
            timestamp: Number(message.messageTimestamp) || Date.now(),
            broadcast: message.key.remoteJid === 'status@broadcast'
          }
  
          chats.messages[message.key.id] = safeMessage
  
          let chatsMessages = Object.entries(chats.messages)
          if (chatsMessages.length > 50) chats.messages = Object.fromEntries(chatsMessages.slice(-50))
        }

    } catch (e) {
      console.error(e)
    }
  }
}

  
  
   
  conn.relayWAMessage = async (pesanfull) => {
  let mekirim = await conn.relayMessage(pesanfull.key.remoteJid, pesanfull.message, { messageId: pesanfull.key.id })
  conn.ev.emit('messages.upsert', { messages: [pesanfull], type: 'append' });
  return mekirim
  }
  
 
  conn.cMod = async (jid, message, text = '', sender = conn.user.jid, options = {}) => {
  if (options.mentions && !Array.isArray(options.mentions)) options.mentions = [options.mentions]
  let copy = message.toJSON()
  delete copy.message.messageContextInfo
  delete copy.message.senderKeyDistributionMessage
  let mtype = Object.keys(copy.message)[0]
  let msg = copy.message
  let content = msg[mtype]
  if (typeof content === 'string') msg[mtype] = text || content
  else if (content.caption) content.caption = text || content.caption
  else if (content.text) content.text = text || content.text
  if (typeof content !== 'string') {
  msg[mtype] = { ...content, ...options }
  msg[mtype].contextInfo = {
  ...(content.contextInfo || {}),
  mentionedJid: options.mentions || content.contextInfo?.mentionedJid || []
  }
  }
  if (copy.participant) sender = copy.participant = sender || copy.participant
  else if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
  if (copy.key.remoteJid.includes('@s.whatsapp.net')) sender = sender || copy.key.remoteJid
  else if (copy.key.remoteJid.includes('@broadcast')) sender = sender || copy.key.remoteJid
  copy.key.remoteJid = jid
  copy.key.fromMe = areJidsSameUser(sender, conn.user.id) || false
  return proto.WebMessageInfo.fromObject(copy)
  }
  
  
  
  

  conn.copyNForward = async (jid, message, forwardingScore = true, options = {}) => {
  let m = generateForwardMessageContent(message, !!forwardingScore)
  let mtype = Object.keys(m)[0]
  if (forwardingScore && typeof forwardingScore == 'number' && forwardingScore > 1) m[mtype].contextInfo.forwardingScore += forwardingScore
  m = generateWAMessageFromContent(jid, m, { ...options, userJid: conn.user.id })
  await conn.relayMessage(jid, m.message, { messageId: m.key.id, additionalAttributes: { ...options }})
  return m
  }
  
  
  
  
  
conn.downloadM = async (m, type, saveToFile = false) => {
  try {
    if (!m || !(m.url || m.directPath)) return Buffer.alloc(0)
    const stream = await downloadContentFromMessage(m, type)
    const chunks = []
    for await (const chunk of stream) {
      chunks.push(chunk)
    }
    const buffer = Buffer.concat(chunks)
    if (saveToFile) {
      const { filename } = await conn.getFile(buffer,true )
      return fs.existsSync(filename) ? filename : buffer
    }
    return buffer
  } catch (e) {
    console.error('Error in downloadM:', e)
    return Buffer.alloc(0)
  }
}
  

 

  /**
   * Get display name from jid (supports contact, group, and self)
   * @param {string} jid
   * @param {boolean} withoutContact
   * @returns {Promise<string>}
   */
  conn.getName = (jid = '', withoutContact = false, metadata) => {
    if (!jid) return ''
  
    const myUsers = Object.keys(db.data.users || {})
    jid = conn.decodeJid(jid)
    withoutContact = conn.withoutContact || withoutContact

    if (jid.endsWith('@g.us')) return conn.chats[jid].subject || 'Grup'

    const isSelf = areJidsSameUser(jid, conn.user?.id)
    const contact = jid === '0@s.whatsapp.net'
      ? { name: 'WhatsApp' }
      : isSelf
      ? conn.user
      : conn.contacts?.[jid] || conn.chats?.[jid] || {}
 
if(jid.endsWith('lid')) return jid
    const fallbackName = myUsers.includes(jid)
      ? db.data.users[jid]?.name
      : jid.replace('@s.whatsapp.net', '').replace(/[\(\)\-\+ ]/g, '')
  
    return (
      contact?.vname ||
      contact?.notify ||
      contact?.verifiedName ||
      contact?.verifiedBizName ||
      contact?.name ||
      fallbackName ||
      'Pengguna'
    )
  }
  
  
  
  conn.insertAllGroup = async() => {
  const groups = await conn.groupFetchAllParticipating().catch(_ => null) || {}
  for (const group in groups) conn.chats[group] = { ...(conn.chats[group] || {}), id: group, subject: groups[group].subject, isChats: true, metadata: groups[group] }
  return conn.chats
  }
  
  
  
  
  
  conn.getBusinessProfile = async (jid) => {
  const results = await conn.query({
  tag: 'iq',
  attrs: {
  to: 's.whatsapp.net',
  xmlns: 'w:biz',
  type: 'get'
  },
  content: [{
  tag: 'business_profile',
  attrs: { v: '244' },
  content: [{
  tag: 'profile',
  attrs: { jid }
  }]
  }]
  })
  const profiles = getBinaryNodeChild(getBinaryNodeChild(results, 'business_profile'), 'profile')
  if (!profiles) return {} // if not bussines
  const address = getBinaryNodeChild(profiles, 'address')
  const description = getBinaryNodeChild(profiles, 'description')
  const website = getBinaryNodeChild(profiles, 'website')
  const email = getBinaryNodeChild(profiles, 'email')
  const category = getBinaryNodeChild(getBinaryNodeChild(profiles, 'categories'), 'category')
  return {
  jid: profiles.attrs?.jid,
  address: address?.content.toString(),
  description: description?.content.toString(),
  website: website?.content.toString(),
  email: email?.content.toString(),
  category: category?.content.toString(),
  }
  }
  
  conn.msToDate = (ms) => {
    let months = Math.floor(ms / (30 * 24 * 60 * 60 * 1000));
    let monthms = ms % (30 * 24 * 60 * 60 * 1000);
    let days = Math.floor(monthms / (24 * 60 * 60 * 1000));
    let daysms = monthms % (24 * 60 * 60 * 1000);
    let hours = Math.floor(daysms / (60 * 60 * 1000));
    let hoursms = daysms % (60 * 60 * 1000);
    let minutes = Math.floor(hoursms / (60 * 1000));
    let minutesms = hoursms % (60 * 1000);
    let sec = Math.floor(minutesms / 1000);
    return months + " Bulan " + days + " Hari " + hours + " Jam " + minutes + " Menit";
  }
  
  
  conn.msToTime = (ms) => {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h + ' Jam ', m + ' Menit ', s + ' Detik'].map(v => v.toString().padStart(2, 0)).join(' ')
  }
  
  conn.msToHour = (ms) => {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  return [h + ' Jam '].map(v => v.toString().padStart(2, 0)).join(' ')
  }
  
  conn.msToMinute = (ms) => {
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  return [m + ' Menit '].map(v => v.toString().padStart(2, 0)).join(' ')
  }
  
  conn.msToSecond = (ms) => {
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [s + ' Detik'].map(v => v.toString().padStart(2, 0)).join(' ')
  }
  
  conn.clockString = (ms) => {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h + ' Jam ', m + ' Menit ', s + ' Detik'].map(v => v.toString().padStart(2, 0)).join(' ')
  }
  
conn.ms = (milliseconds) => {
  const roundTowardsZero = milliseconds > 0 ? Math.floor : Math.ceil;

  return {
    days: roundTowardsZero(milliseconds / 86400000),
    hours: roundTowardsZero(milliseconds / 3600000) % 24,
    minutes: roundTowardsZero(milliseconds / 60000) % 60,
    seconds: roundTowardsZero(milliseconds / 1000) % 60,
    milliseconds: roundTowardsZero(milliseconds) % 1000
  };
}


conn.toMs = (input) => {
  if (typeof input !== 'string') return NaN;

  const unitMap = {
    ms: 1,
    millisecond: 1,
    milliseconds: 1,

    s: 1000,
    sec: 1000,
    secs: 1000,
    second: 1000,
    seconds: 1000,

    m: 60000,
    min: 60000,
    mins: 60000,
    minute: 60000,
    minutes: 60000,

    h: 3600000,
    hr: 3600000,
    hrs: 3600000,
    hour: 3600000,
    hours: 3600000,

    d: 86400000,
    day: 86400000,
    days: 86400000,

    w: 604800000,
    week: 604800000,
    weeks: 604800000,

    y: 31557600000,
    yr: 31557600000,
    year: 31557600000,
    years: 31557600000
  };

  let total = 0;
  const regex = /(-?\d+(?:\.\d+)?)(?:\s*)([a-zA-Z]+)/g;
  let match;

  while ((match = regex.exec(input.toLowerCase())) !== null) {
    const value = parseFloat(match[1]);
    const unit = match[2];
    const factor = unitMap[unit];
    if (!factor) return NaN;
    total += value * factor;
  }

  return total;
}
  

conn.sendTextWithMentions = async (jid, text, quoted, options = {}) => conn.sendMessage(jid, { text: text, contextInfo: { mentionedJid: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net') }, ...options }, { quoted })
  

  //SEND 1 KONTAK
  conn.sendKontak = (jid, nomor, nama, org = "", quoted = '', opts = {} ) => {
  const vcard ="BEGIN:VCARD\n"
  +"VERSION:3.0\n"
  + "FN:" +nama +"\n"
  +"ORG:" + org + "\n"
  +"TEL;type=CELL;type=VOICE;waid=" +nomor + ":+" +nomor +"\n"
  +"item1.X-ABLabel:Ponsel\n"
  +"item2.EMAIL;type=INTERNET:okeae2410@gmail.com\n"
  +"item2.X-ABLabel:Email\nitem3.URL:https://instagram.com/cak_haho\n"
  +"item3.X-ABLabel:Instagram\n"
  +"item4.ADR:;;Indonesia;;;;\n"
  +"item4.X-ABLabel:Region\n"
  +"END:VCARD"
  conn.sendMessage(jid,{contacts: {displayName: nama, contacts: [{ vcard }] }, ...opts},{quoted})
  };
  
  
  
  
  //Funtion untuk mengganti nama file
  conn.renameFile = async(path, newPath) => {
  return new Promise((res, rej) => {
  fs.rename(path, newPath, (err, data) =>
  err
  ? rej(err)
  : res(data));
  });
  }
  

  //Function agar bisa ngetag orang
  conn.parseMention = (text = '') => {
  return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
  }
  
 
  
  
 
//Function untuk send file dari link,buffer,atau anu 
// conn.sendFile(m.chat, 'https://telegra.ph/file/xxx.jpg', '', 'Nih gambar', m)
// conn.sendFile(m.chat, fs.readFileSync('./video.mp4'), 'video.mp4', 'Nih video', m)
// conn.sendFile(m.chat, 'data:image/png;base64,...', '', 'Base64 nih', m)
conn.sendFile = async (jid, input, filename = '', caption = '', quoted, ptt = false, options = {}) => {
  let buffer, res, ext, mime, pathFile

  // Kalau input berupa URL, download dan simpan ke file temporer
  if (/^https?:\/\//.test(input)) {
    res = await axios.get(input, { responseType: 'arraybuffer' })
    buffer = Buffer.from(res.data)
    const type = await fileTypeFromBuffer(buffer)
    mime = type?.mime || 'application/octet-stream'
    ext = type?.ext || 'bin'
    filename = filename || `file.${ext}`
    pathFile = path.join(tmpdir(), filename)
    fs.writeFileSync(pathFile, buffer)
  } else if (Buffer.isBuffer(input)) {
    buffer = input
    const type = await fileTypeFromBuffer(buffer)
    mime = type?.mime
    ext = type?.ext
    pathFile = path.join(tmpdir(), filename || `file.${ext}`)
    fs.writeFileSync(pathFile, buffer)
  } else if (typeof input === 'string' && fs.existsSync(input)) {
    pathFile = input
    buffer = fs.readFileSync(input)
    const type = await fileTypeFromBuffer(buffer)
    mime = type?.mime
    ext = type?.ext
  } else {
    throw new Error('Input tidak valid: bukan URL, buffer, atau path file')
  }

  // Tentukan media type untuk WA
  let mtype = ''
  if (/webp/.test(mime)) mtype = 'sticker'
  else if (/image/.test(mime)) mtype = 'image'
  else if (/video/.test(mime)) mtype = 'video'
  else if (/audio/.test(mime)) {
    mtype = 'audio'
    mime = 'audio/ogg; codecs=opus'
  } else mtype = 'document'

  // Kirim pesan
  const msg = await conn.sendMessage(jid, {
    ...options,
    caption,
    ptt,
    [mtype]: { url: pathFile },
    mimetype: mime
  }, {
    quoted,
    ...options
  })

  // Hapus file jika disimpan temporer
  if (/^https?:\/\//.test(input) || Buffer.isBuffer(input)) {
    try { fs.unlinkSync(pathFile) } catch (e) {}
  }

  return msg
}

  
  
  
  
  
  

conn.logger = {
  info(...args) {
    console.log(
      chalk.blue('[INFO]'),
     `[${new Date().toUTCString()}]:`,
      format(...args)
    )
  },
  error(...args) {
    console.log(
      chalk.redBright('[ERROR]'),
      `[${new Date().toUTCString()}]:`,
      chalk.red(format(...args))
    )
  },
  warn(...args) {
    console.log(
      chalk.yellow('[WARNING]'),
     `[${new Date().toUTCString()}]:`,
      chalk.yellowBright(format(...args))
    )
  },
  trace(...args) {
    console.log(
      chalk.magenta('[TRACE]'),
    `[${new Date().toUTCString()}]:`,
      chalk.magenta(format(...args))
    )
  },
  debug(...args) {
    console.log(
      chalk.cyan('[DEBUG]'),
    `[${new Date().toUTCString()}]:`,
      chalk.cyanBright(format(...args))
    )
  }
}
  
  
  
  conn.adReply = async (jid, text, title = '', body = '', buffer, source = '', quoted, options) => {
  let { data } = await conn.getFile(buffer, true)
  return conn.sendMessage(jid, { text: text,
  contextInfo: {
  mentionedJid: await conn.parseMention(text),
  externalAdReply: {
  showAdAttribution: true,
  mediaType: 1,
  title: title,
  body: body,
  thumbnail: data,
  renderLargerThumbnail: true,
  sourceUrl: source
  }
  }
  }, { quoted: quoted, ...options })
  }
  
  
 
  
  
 
  
  //Untuk mendeteksi size pada folder
  conn.getDirSize = (dirPath) => {
  let size = 0;
  const files = fs.readdirSync(dirPath);
  for (let i = 0; i < files.length; i++) {
  const filePath = path.join(dirPath, files[i]);
  const stats = fs.statSync(filePath);
  if (stats.isFile()) {
  size += stats.size;
  } else if (stats.isDirectory()) {
  size += conn.getDirSize(filePath);
  }
  }
  return size;
  };
  
  //Untuk mendeteksi size pada file
  conn.getFileSize = (filename) => {
  let stats = fs.statSync(filename);
  let fileSizeInBytes = stats.size;
  return fileSizeInBytes;
  }
  





conn.toSticker = async (from,path, m) => {
let { filename: inputFile} = await conn.getFile(path, true)
let outputFile = getRandomFile('.webp')

  const args = [
    '-i', inputFile,
    '-vcodec', 'libwebp',
    '-vf',
    "scale='min(512,iw)':min'(512,ih)':force_original_aspect_ratio=decrease,fps=15,pad=512:512:-1:-1:color=white@0.0,split[a][b];[a]palettegen=reserve_transparent=on:transparency_color=ffffff[p];[b][p]paletteuse",
    '-loop', '0',
    '-ss', '00:00:00.0',
    '-t', '00:00:10.0',
    '-preset', 'default',
    '-an', '-vsync', '0',
    outputFile
  ]

  await new Promise((resolve, reject) => {
    const ff = spawn(ffmpegPath, args)
    ff.stderr.on('data', data => { }) // opsional: log progress
    ff.on('close', code => {
      if (code === 0) resolve()
      else reject(new Error('ffmpeg error, exit code ' + code))
    })
  }).catch(async (err) => {
 log(err)
  })

  // kasih Exif kalau mau
  const img = new webp.Image()
  const exifData = {
    "sticker-pack-id": "your-id",
    "sticker-pack-name": m.pushname,
    "sticker-pack-publisher": "",
    "emojis": ["✨"],
  }
  const exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00,
    0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x16, 0x00, 0x00, 0x00])
  const jsonBuf = Buffer.from(JSON.stringify(exifData), 'utf-8')
  const exif = Buffer.concat([exifAttr, jsonBuf])
  exif.writeUIntLE(jsonBuf.length, 14, 4)
  await img.load(outputFile)
  img.exif = exif
  await img.save(outputFile)
  await conn.sendMessage(m.chat, { sticker: fs.readFileSync(outputFile) }, { quoted: m })
  fs.unlinkSync(inputFile)
  fs.unlinkSync(outputFile)
  
}




  
  conn.fileSize = (bytes) => {
  if (bytes === 0) {
  return "0 B";
  }
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`;
  }
  
  
  
  
  Object.defineProperty(conn, 'name', {
  value: { ...(options.chats || {}) },
  configurable: true,
  })
  
 
  return conn
  
  
  
  
  
  
  
  
  
  //------------------------------[ BATAS KATULISTIWA ]----------------------------\\
  }
  
  export const smsg = async (conn, m, hasParent) => {
  if (!m) return m
  await conn.pushMessage(m)
  let M = proto.WebMessageInfo
  //m = M.fromObject(m)
  if (m.key) {
  m.id = m.key.id
  m.isBaileys = m.id && m.id.length === 22 || m.id.startsWith('3EB0') && m.id.length === 22 || false
  m.chat = conn.decodeJid(m.key.remoteJid || message.message?.senderKeyDistributionMessage?.groupId || '')
  m.messageTimestamp = Math.floor(Date.now() / 1000)
  m.isGroup = m.chat.endsWith('@g.us')
  m.sender = conn.decodeJid(m.key.fromMe && conn.user.id || m.participant || m.key.participant || m.chat || '')
  m.fromMe = m.key.fromMe || areJidsSameUser(m.sender, conn.user.id)
 
  
  
  if(m.isGroup){
    m.groupMetadata = ((conn.chats[m.chat] || {}).metadata || await conn.groupMetadata(m.chat).catch(_ => null)) || {}
    m.groupName =  m.groupMetadata.subject || ''
    m.groupId =  m.groupMetadata.id  || ''
    m.isGroup = m.groupId.endsWith('@g.us') && !m.groupMetadata.parent
    m.isCommunity = m.groupId.endsWith('@g.us') && m.groupMetadata.isCommunity  
    m.groupDesc =  m.groupMetadata.desc  || ''
 
    if(m.groupMetadata.addressingMode && (m.groupMetadata.addressingMode == 'lid' || m.groupMetadata.addressingMode == 'lid-update') ){
      m.groupMembers = m.groupMetadata.addressingMode == 'lid'? m.groupMetadata.participants.map(p => ({lid: p.id, id: p?.jid || p?.phone || p?.phoneNumber ,admin: p.admin})) : m.groupMetadata.participants 
      m.sender = m.sender.endsWith('@lid')? m.groupMembers.find(p => p.lid === m.sender)?.id || m.sender  : m.sender  
      m.groupOwner =  m.groupMetadata.subjectOwner  //m.groupMembers.find(p => p.lid === m.groupMetadata.subjectOwner).id || m.groupMetadata.subjectOwner      
      m.user = m.groupMembers.find(p => p.id === m.sender)  || {} // User Data
      m.bot = m.groupMembers.find(u => conn.decodeJid(u.id) == conn.user.jid)  || {}
      m.isRAdmin = m.user && m.user.admin == 'superadmin' || false
      m.isAdmin = m.isRAdmin || m.user && m.user.admin == 'admin' || false
      m.isBotAdmin = m.bot && m.bot.admin == 'admin' || false // Are you Admin?
    } else {
      m.groupOwner = m.groupMetadata.subjectOwner  || ''
      m.groupMembers = m.groupMetadata.participants || []
      m.user = m.groupMembers.find(u => conn.decodeJid(u.id) === m.sender)  || {} // User Data
      m.bot =  m.groupMembers.find(u => conn.decodeJid(u.id) == conn.user.jid) || {} // Your Data
      m.isRAdmin = m.user && m.user.admin == 'superadmin' || false
      m.isAdmin = m.isRAdmin || m.user && m.user.admin == 'admin' || false
      m.isBotAdmin = m.bot && m.bot.admin == 'admin' || false // Are you Admin?
    }
  
  
    }
  
  }

  //(m.type == 'stickerMessage') ? db.data.users[m.sender].sticker[m.message.stickerMessage.fileSha256]? db.data.users[m.sender].sticker[m.message.stickerMessage.fileSha256].text : false : 
 
  if (m.message) {    
  m.type = getContentType(m.message)
  m.content = JSON.stringify(m.message)
  m.botNumber = conn.user.id ? conn.user.id.split(":")[0]+"@s.whatsapp.net" : conn.user.jid
  m.senderNumber = m.sender.split("@")[0]
  m.pushname = m.pushName || "No Name"
  m.download = (saveToFile = false) => conn.downloadM(m, m.type.replace(/message/i, ''), saveToFile)
  m.mentionByTag = (m => (m.message?.[m.type]?.contextInfo?.mentionedJid || []).map(id => id.endsWith('@lid') ? m.groupMembers?.find(x => x.lid === id)?.id || id : id))(m)
  m.mentionByReply = (m => {
  let p = m.message?.[m.type]?.contextInfo?.participant || ""
  return p.endsWith('@lid') ? m.groupMembers.find(x => x.lid === p)?.id || "" : p
  })(m)

  m.mention = m.mentionByReply? m.mentionByReply : m.mentionByTag[0] || false
  m.budy = (m.type === 'conversation') ? m.message.conversation : (m.type === 'extendedTextMessage') ? m.message.extendedTextMessage.text : ""
   
  
  // Pastikan objek global.db.data.users[m.sender] telah didefinisikan
  if (global.db.data.users[m.sender]) {
    // Jika objek telah didefinisikan, lanjutkan dengan mengakses properti 'sticker'
    global.db.data.users[m.sender].sticker = global.db.data.users[m.sender].sticker || {};
  } else {
    // Jika objek belum didefinisikan, inisialisasi objek global.db.data.users[m.sender] dengan properti 'sticker'
    global.db.data.users[m.sender] = { sticker: {} };
  }
  
  


  
  let cmdStik = (m.type == 'stickerMessage') ? db.data.users[m.sender].sticker[m.message.stickerMessage.fileSha256] : ''
  m.body = (m.type === 'conversation' && m.message.conversation) ? m.message.conversation :(['interactiveMessage', 'interactiveResponseMessage'].includes(m.type)) ?(m.message?.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson ?(JSON.parse(m.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson)?.id || '') :'') :
  (m.type === 'imageMessage' && m.message.imageMessage?.caption) ? m.message.imageMessage.caption :
  (m.type === 'stickerMessage') ? (cmdStik?.text || '') :
  (m.type === 'videoMessage' && m.message.videoMessage?.caption) ? m.message.videoMessage.caption :
  (m.type === 'extendedTextMessage' && m.message.extendedTextMessage?.text) ? m.message.extendedTextMessage.text :
  (m.type === 'buttonsResponseMessage' && m.message.buttonsResponseMessage?.selectedButtonId) ? m.message.buttonsResponseMessage.selectedButtonId :
  (m.type === 'listResponseMessage' && m.message.listResponseMessage?.singleSelectReply?.selectedRowId) ? m.message.listResponseMessage.singleSelectReply.selectedRowId :
  (m.type === 'templateButtonReplyMessage' && m.message.templateButtonReplyMessage?.selectedId) ? m.message.templateButtonReplyMessage.selectedId :
  (m.type === 'viewOnceMessageV2') ?(m.message?.viewOnceMessageV2?.message?.imageMessage?.caption||m.message?.viewOnceMessageV2?.message?.videoMessage?.caption ||'') :'';

  m.args = (typeof m.body === 'string' ? m.body.trim() : '').split(/ +/).slice(1)
  m.numberQuery = isNumber(m.args)? m.args.join(' ').replace(new RegExp("[()+-/ +/]", "gi"), "") + `@s.whatsapp.net`:''
  
  m.msg = (m.type == 'viewOnceMessage' ? m.message[m.type].message[getContentType(m.message[m.type].message)] : m.message[m.type])
  if (m.chat == 'status@broadcast' && ['protocolMessage', 'senderKeyDistributionMessage'].includes(m.type)) m.chat = (m.key.remoteJid !== 'status@broadcast' && m.key.remoteJid) || m.sender
  if (m.type == 'protocolMessage' && m.msg.key) {
  if (m.msg.key.remoteJid == 'status@broadcast') m.msg.key.remoteJid = m.chat
  if (!m.msg.key.participant || m.msg.key.participant == 'status_me') m.msg.key.participant = m.sender
  m.msg.key.fromMe = conn.decodeJid(m.msg.key.participant) === conn.decodeJid(conn.user.id)
  if (!m.msg.key.fromMe && m.msg.key.remoteJid === conn.decodeJid(conn.user.id)) m.msg.key.remoteJid = m.sender
  }
  


  
  m.myButton = m.isGroup && (m.type == 'interactiveResponseMessage' && m.message.interactiveResponseMessage.contextInfo.participant !== m.botNumber
  || m.type == 'templateButtonReplyMessage' && m.message.templateButtonReplyMessage.contextInfo.participant !== m.botNumber
  || m.type == 'listResponseMessage' && m.message.listResponseMessage.contextInfo.participant !== m.botNumber)
  
  m.ucapanWaktu = getUcapanWaktu()
  m.text =  m.body
  
  m.mentionedJid = m.msg?.contextInfo?.mentionedJid?.length && m.msg.contextInfo.mentionedJid || []
  let quoted = m.quoted = m.msg?.contextInfo?.quotedMessage ? m.msg.contextInfo.quotedMessage : null
  if (m.quoted) {
  let type = Object.keys(m.quoted)[0]
  m.quoted = m.quoted[type]
  if (typeof m.quoted === 'string') m.quoted = { text: m.quoted }
  m.quoted.type = type
  m.quoted.id = m.msg.contextInfo.stanzaId
  m.quoted.chat = conn.decodeJid(m.msg.contextInfo.remoteJid || m.chat || m.sender)
  m.quoted.isBaileys = m.quoted.id.length === 22 || m.quoted.id.startsWith('3EB0') && m.quoted.id.length === 22 || false
  m.quoted.sender = conn.decodeJid(m.msg.contextInfo.participant)
  m.quoted.fromMe = m.quoted.sender === conn.user.jid
  m.quoted.text = m.quoted.text || m.quoted.caption || m.quoted.contentText || ''
  m.quoted.name = conn.getName(m.quoted.sender)
  m.quoted.mentionedJid = m.quoted.contextInfo?.mentionedJid?.length && m.quoted.contextInfo.mentionedJid || []
  let vM = m.quoted.fakeObj = {
    key: {
      fromMe: m.quoted.fromMe,
      remoteJid: m.quoted.chat,
      id: m.quoted.id
    },
    message: quoted,
    ...(m.isGroup ? { participant: m.quoted.sender } : {})
  }  //M.fromObject({})
  
  
  
  m.getQuotedObj = m.getQuotedMessage = async () => {
  if (!m.quoted.id) return null
  let q = M.fromObject(await conn.loadMessage(m.quoted.id) || vM)
  return smsg(conn, q)
  }
  

  m.quoted.download = (saveToFile = false) => conn.downloadM(m.quoted, m.quoted.type.replace(/message/i, ''), saveToFile)
  m.quoted.reply = (text, chatId, options) => conn.reply(chatId ? chatId : m.chat, text, vM, options)
  m.quoted.copy = () => exports.smsg(conn, M.fromObject(M.toObject(vM)))
  m.quoted.forward = (jid, forceForward = false) => conn.forwardMessage(jid, vM, forceForward)
  m.quoted.copyNForward = (jid, forceForward = true, options = {}) => conn.copyNForward(jid, vM, forceForward, options)
  m.quoted.cMod = (jid, text = '', sender = m.quoted.sender, options = {}) => conn.cMod(jid, vM, text, sender, options)
  m.quoted.delete = () => conn.sendMessage(m.quoted.chat, { delete: vM.key })
  }
  }
 if (m.msg && m.msg.url) m.download = (saveToFile = false) => conn.downloadM(m.msg, m.type.replace(/message/i, ''), saveToFile)

 
  m.reply = (text, chatId, options) => conn.reply(chatId ? chatId : m.chat, text, m, options)
  m.react = (text) => conn.sendMessage(m.chat, { react: { text, key: m.key } });
  m.copyNForward = (jid = m.chat, forceForward = true, options = {}) => conn.copyNForward(jid, m, forceForward, options)
  m.cMod = (jid, text = '', sender = m.sender, options = {}) => conn.cMod(jid, m, text, sender, options)
  m.delete = () => conn.sendMessage(m.chat, { delete: m.key })
 
  


try {
conn.saveName(m.sender, m.pushname)
if (m.msg && m.type == 'protocolMessage') conn.ev.emit('message.delete', m.msg.key)
} catch (e) {
console.error(e)
}

return m
}
  



  
  
  
  
  export function protoType() {
  Buffer.prototype.toArrayBuffer = function toArrayBufferV2() {
  const ab = new ArrayBuffer(this.length);
  const view = new Uint8Array(ab);
  for (let i = 0; i < this.length; ++i) {
  view[i] = this[i];
  }
  return ab;
  }
  /**
  * @returns {ArrayBuffer}
  */
  Buffer.prototype.toArrayBufferV2 = function toArrayBuffer() {
  return this.buffer.slice(this.byteOffset, this.byteOffset + this.byteLength)
  }
  /**
  * @returns {Buffer}
  */
  ArrayBuffer.prototype.toBuffer = function toBuffer() {
  return Buffer.from(new Uint8Array(this))
  }
  // /**
  //  * @returns {String}
  //  */
  // Buffer.prototype.toUtilFormat = ArrayBuffer.prototype.toUtilFormat = Object.prototype.toUtilFormat = Array.prototype.toUtilFormat = function toUtilFormat() {
  //     return util.format(this)
  // }
  Uint8Array.prototype.getFileType = ArrayBuffer.prototype.getFileType = Buffer.prototype.getFileType = async function getFileType() {
  return await fileTypeFromBuffer(this)
  }
  /**
  * @returns {Boolean}
  */
  String.prototype.isNumber = Number.prototype.isNumber = isNumber
  /**
  *
  * @returns {String}
  */
  String.prototype.capitalize = function capitalize() {
  return this.charAt(0).toUpperCase() + this.slice(1, this.length)
  }
  /**
  * @returns {String}
  */
  String.prototype.capitalizeV2 = function capitalizeV2() {
  const str = this.split(' ')
  return str.map(v => v.capitalize()).join(' ')
  }
  String.prototype.decodeJid = function decodeJid() {
  if (/:\d+@/gi.test(this)) {
  const decode = jidDecode(this) || {}
  return (decode.user && decode.server && decode.user + '@' + decode.server || this).trim()
  } else return this.trim()
  }
  /**
  * number must be milliseconds
  * @returns {string}
  */
  Number.prototype.toTimeString = function toTimeString() {
  // const milliseconds = this % 1000
  const seconds = Math.floor((this / 1000) % 60)
  const minutes = Math.floor((this / (60 * 1000)) % 60)
  const hours = Math.floor((this / (60 * 60 * 1000)) % 24)
  const days = Math.floor((this / (24 * 60 * 60 * 1000)))
  return (
  (days ? `${days} day(s) ` : '') +
  (hours ? `${hours} hour(s) ` : '') +
  (minutes ? `${minutes} minute(s) ` : '') +
  (seconds ? `${seconds} second(s)` : '')
  ).trim()
  }
  Number.prototype.getRandom = String.prototype.getRandom = Array.prototype.getRandom = getRandom
  }
  
  function isNumber() {
  const int = parseInt(this)
  return typeof int === 'number' && !isNaN(int)
  }
  
  
  function getRandom() {
  if (Array.isArray(this) || this instanceof String) return this[Math.floor(Math.random() * this.length)]
  return Math.floor(Math.random() * this)
  }
  
  
  /**
  * ??
  * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator
  * @returns {boolean}
  */
  function nullish(args) {
  return !(args !== null && args !== undefined)
  }


  function getUcapanWaktu() {
    const hour = parseInt(moment().tz('Asia/Jakarta').format('HH'))
    if (hour >= 4 && hour < 11) return 'Selamat pagi'
    if (hour >= 11 && hour < 15) return 'Selamat siang'
    if (hour >= 15 && hour < 18) return 'Selamat sore'
    return 'Selamat malam'
  }