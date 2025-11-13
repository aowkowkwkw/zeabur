import { Low, JSONFile } from '../modules/lowdb.js';
import { mongoDB } from "../modules/mongoDB.js";

// Skema default (data awal kalau database kosong)
const defaultData = {
  version: 1,
  allcommand: [],
  anonymous: [],
  blockcmd: [],
  banned: [],
  claim: [],
  data: [],
  lowfeature: [],
  antispam: [],
  dashboard: [],
  listerror: [],
  sticker: {},
  stickerBot: {},
  audio: {},
  hittoday: [],
  users: {},
  chats: {},
  settings: {
    settingbot: {} // Sub-kategori setting utama
  },
  kickon: {},
  others: {},
  respon: {},
  contacts: {},
  menfess: {},
  classifier : ''
};

// Default untuk pengaturan bot
const defaultSettings = {
  antiCall: true,
  autoBio: false,
  autoDelSessi: false,
  autoDelTmp: false,
  autoDelTrash: true,
  autoLevel: true,
  autoReport: true,
  autoSticker: false,
  autoblockcmd: false,
  autotyping: true,
  clearSessionFile: 1000, // Jumlah maksimal session sebelum dihapus
  delay: 0,
  docType: "docx",
  emojiReact: ["❤️", "💛", "💚", "💙", "💜"],
  fake: global.botName, // Nama bot dari global
  gcOnly: false,
  multi: true,
  prefix: "!",
  publik: true,
  Qoted: "ftoko", // Tipe qouted reply
  reactStory: false,
  readChat: false,
  replyType: "web",
  setmenu: "document",
  setwelcome: "type11",
  status: new Date().getTime(), // Timestamp awal untuk status bot
  viewStory: false,
  smartRespon: false
};

// Flag untuk menghindari load ganda
let loading = false;
let loadedOnce = false;

// Fungsi utama untuk inisialisasi database
export default async function initDatabase() {
  // Fungsi bantu untuk cek valid number
  const isNumber = (x) => typeof x === "number" && !isNaN(x);
  global.isNumber = isNumber;

  // Kalau sudah pernah load dan global.db ada, skip init
  if (global.db && loadedOnce) return;

  // Pilih adapter berdasarkan apakah pakai MongoDB atau JSON
  const adapter = global.mongodb && typeof global.mongodb === "string"
    ? new mongoDB(global.mongodb, global.dbName) // pakai MongoDB
    : new JSONFile("database/database.json");    // fallback ke file lokal

  const adapter1 = new JSONFile("database/contacts.json");
  const adapter2 = new JSONFile("database/chats.json");




  // Buat database instance
  global.db = new Low(adapter, {});
  global.dbContacts = new Low(adapter1,{})
  global.dbChats = new Low(adapter2,{})

  // Fungsi untuk membaca data dan memastikan struktur lengkap
  global.loadDatabase = async function loadDatabase() {
    if (loading) return; // Jangan load paralel
    loading = true;

    // Baca data dari sumber (file/Mongo)
    await global.db.read();
    await global.dbContacts.read();
    await global.dbChats.read()

    // Jika kosong, inisialisasi jadi object kosong
    global.db.data ||= {};
    global.dbContacts.data ||= { contacts: {} }
    global.dbChats.data ||= { chats: {} }

    // Pastikan setiap key dari defaultData ada
    for (const key in defaultData) {
      if (!(key in global.db.data)) global.db.data[key] = defaultData[key];
    }

    // Pastikan settingbot ada
    global.db.data.settings ||= {};
    global.db.data.settings.settingbot ||= {};

    const settings = global.db.data.settings.settingbot;

    // Isi default setting jika belum diset
    for (const [key, val] of Object.entries(defaultSettings)) {
      if (settings[key] == null) settings[key] = val;
    }

    // Auto-fix untuk nilai angka yang rusak
    if (!isNumber(settings.status)) settings.status = new Date().getTime();
    if (!isNumber(settings.clearSessionFile)) settings.clearSessionFile = 1000;
    if (!isNumber(settings.delay)) settings.delay = 0;

    loading = false;
    loadedOnce = true;

    // Tulis kembali ke file kalau pakai adapter JSONFile
    if (adapter instanceof JSONFile) {
      await global.db.write();
    }

     if (adapter1 instanceof JSONFile) {
      await global.dbContacts.write();
    }

       if (adapter2 instanceof JSONFile) {
      await global.dbChats.write();
    }

 
  };







  // Langsung jalankan load saat inisialisasi
  await global.loadDatabase();
  
}
