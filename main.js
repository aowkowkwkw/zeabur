//process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
import "./settings.js";
const {
useMultiFileAuthState,
makeCacheableSignalKeyStore,
fetchLatestBaileysVersion,
} = (await import("baileys")).default;
import fs, { readdirSync, existsSync, readFileSync, watch, statSync } from "fs";
import { Socket, smsg, protoType } from "./lib/simple.js";
import path, { join, dirname, basename } from "path";
import { memberUpdate, groupsUpdate } from "./message/group.js";
import { antiCall } from "./message/anticall.js";
import { connectionUpdate } from "./message/connection.js";
import { createRequire } from "module";
import { fileURLToPath, pathToFileURL } from "url";
import { platform } from "process";
import syntaxerror from './modules/syntaxerror.js';
import chokidar from "chokidar";
import chalk from './modules/chalk.js';
import util from './modules/util.js'
import { initPremiumChecker } from './lib/premium-checker.js'
import liteStore from './modules/liteStore.js'
import { antiDouble } from './lib/antiDouble.js'
import logger from './modules/logger.js'
import initDatabase from "./message/database.js";
import { updateUserData,getDefaultUserData,updateChatData,getDefaultChatData  } from './message/register.js'
import { ensureClassifier } from './lib/classifier.js'
const { proto} = require('baileys')


const __dirname = dirname(fileURLToPath(import.meta.url));
global.__filename = function filename(pathURL = import.meta.url,rmPrefix = platform !== "win32") {
return rmPrefix? /file:\/\/\//.test(pathURL)? fileURLToPath(pathURL): pathURL: pathToFileURL(pathURL).toString();
};
/*
global.__dirname = function dirname(pathURL) {
return path.dirname(global.__filename(pathURL, true))
};
*/
global.__require = function require(dir = import.meta.url) {
  return createRequire(dir);
};

protoType();


logger.setLevel('fatal')
const msgRetryCounterMap = new Map()

const sessionDir = global.session // folder session kamu
const sessionFile = path.join(sessionDir, 'creds.json') // file session utama

// 🔧 CEK & RESET SESSION RUSAK

if (fs.existsSync(sessionFile)) {
  try {
    const creds = JSON.parse(fs.readFileSync(sessionFile, 'utf-8'))
    if (!creds.registered) {
      console.warn('⚠️ Session rusak (belum terdaftar), menghapus dan reset session...')
      fs.unlinkSync(sessionFile)
    }
  } catch (e) {
    console.warn('⚠️ Gagal membaca session atau corrupt, menghapus...')
    fs.unlinkSync(sessionFile)
  }
}







//Connect to WhatsApp
const connectToWhatsApp = async () => {
await initDatabase();
if(db.data.settings.settingbot.smartRespon) ensureClassifier()
const { state, saveCreds } = await useMultiFileAuthState(session);
const { version, isLatest } = await fetchLatestBaileysVersion();

 
const getMessage = async (key) => {
const msg = liteStore.getMessage(key.remoteJid, key.id)
return msg?.message || proto.Message.fromObject({})
}

//Untuk menyimpan session
const auth = {
creds: state.creds,
/** caching makes the store faster to send/recv messages */
keys: makeCacheableSignalKeyStore(state.keys, logger)
};


//Funtion agar bisa pake button di bailey terbaru
const patchMessageBeforeSending = (message) => {
const requiresPatch = !!(
message.buttonsMessage ||
message.listMessage ||
message.templateMessage
);
if (requiresPatch) {
message = {
viewOnceMessage: {
message: {
messageContextInfo: {
deviceListMetadataVersion: 2,
deviceListMetadata: {},
},
...message,
},
},
};
}
return message;
};


 
//Koneksi nih silakan di isi
const connectionOptions = {
version,
printQRInTerminal: !global.pairingCode,
patchMessageBeforeSending,
logger,
auth,
getMessage,
keepAliveIntervalMs: 20000,
defaultQueryTimeoutMs: undefined,  
connectTimeoutMs: 30000,
emitOwnEvents: true,
fireInitQueries: true,
generateHighQualityLinkPreview: true,
syncFullHistory: true,
markOnlineOnConnect: true,
fetchPresence: true,
msgRetryCounterMap,
};

global.conn = Socket(connectionOptions);

 

if(global.pairingCode && !conn.authState.creds.registered) {
if(global.nomerBot == "") return console.log("Masukan nomer bot di settings.js")
setTimeout(async () => {
let code = await conn.requestPairingCode(global.nomerBot);
code = code?.match(/.{1,4}/g)?.join("-") || code;
console.log(
chalk.black(chalk.green(`✅ Your Phone Number : `)),
chalk.black(chalk.white(global.nomerBot)),
chalk.black(chalk.green(`\n✅ Your Pairing Code : `)),
chalk.black(chalk.white(code))
);
}, 3000);
}
  



conn.ev.process(async (events) => {

//Cnnection Update
if (events["connection.update"]) {
if (db.data == null) await loadDatabase();
const update = events["connection.update"];
await connectionUpdate(connectToWhatsApp, conn, update);
initPremiumChecker(conn, db)
}



// credentials updated -- save them
if (events["creds.update"]) {await saveCreds()}

    
// received a new message
if (events["messages.upsert"]) {
const { handler } = await import(`./handler.js?v=${Date.now()}`).catch((err) => console.log(err));
const chatUpdate = events["messages.upsert"];
    
liteStore.add(chatUpdate.messages)

if (!chatUpdate.messages || !chatUpdate.messages[0]) return  
let m = chatUpdate.messages[0];
let id = m.key.id
let from = m.key.remoteJid
if (!m.message) {return}
if(!m.pushName){return}
if (antiDouble(id, 'upsert', { from })) {return}
m = await smsg(conn, m);      
      

try{

if (global.db.data.users[m.sender]) {
updateUserData(global.db.data.users[m.sender], m);
} else global.db.data.users[m.sender] = getDefaultUserData(m);

if (m.isGroup) {
if (global.db.data.chats[m.chat]) {
updateChatData(global.db.data.chats[m.chat], m); 
} else global.db.data.chats[m.chat] = getDefaultChatData(m);
}



if (global.db.data) global.db.write();
handler(conn, m, chatUpdate);

} catch(err){
log(err)
let e = util.format(err)
let a = util.format(m)
await conn.sendMessage(ownerBot, {text:e+'\n\n\nMessage upsert'})
await conn.sendMessage(ownerBot, {text:a})
}
}


//Anti Call
if (events.call) {antiCall(db, events.call, conn);}


//Member Update
if (events["group-participants.update"]) {
const anu = events["group-participants.update"];
if (global.db.data == null) await loadDatabase();
memberUpdate(conn, anu);
}



//------------------------------------[BATAS]--------------------------------\\
});





const pluginFolder = path.join(__dirname, "./plugins");
const pluginFilter = (filename) => /\.js$/.test(filename);
global.plugins = {};

async function filesInit(folderPath) {
const files = readdirSync(folderPath);

for (let file of files) {
const filePath = join(folderPath, file);
const fileStat = statSync(filePath);

if (fileStat.isDirectory()) {
// Jika file adalah sebuah direktori, panggil kembali fungsi filesInit dengan folder baru sebagai parameter
await filesInit(filePath);
} else if (pluginFilter(file)) {
// Jika file adalah file JavaScript, lakukan inisialisasi
try {
const module = await import("file://" + filePath);
global.plugins[file] = module.default || module;
} catch (e) {
conn.logger.error(e);
delete global.plugins[file];
}
}
}
}

filesInit(pluginFolder);

 

// Set global untuk menyimpan plugin yang sudah dilaporkan error
if (!global.pluginsErrorReported) global.pluginsErrorReported = new Set();

global.reload = async (_ev, filename) => {
  if (pluginFilter(filename)) {
    let dir = global.__filename(join(filename), true); //pluginFolder

    if (filename in global.plugins) {
      if (existsSync(dir))
        console.log(chalk.bgGreen(chalk.black("[ UPDATE ]")), chalk.white(`${filename}`));
      else {
        conn.logger.warn(`deleted plugin '${filename}'`);
        return delete global.plugins[filename];
      }
    } else
      console.log(chalk.bgGreen(chalk.black("[ UPDATE ]")), chalk.white(`${filename}`));

    // Cek syntax pakai syntax-error
    let err = syntaxerror(readFileSync(dir, 'utf8'), filename, {
      sourceType: "module",
      allowAwaitOutsideFunction: true,
    });

    if (err) {
      if (!global.pluginsErrorReported.has(filename)) {
        global.pluginsErrorReported.add(filename);

        conn.logger.error(`syntax error while loading '${filename}'\n${err}`);
        if (global.ownerBot) {
          const pesanError = `❌ *Plugin Error Detected*

📂 *File:* \`${filename}\`

⚠️ *Error Message:*
\`\`\`
${err}
\`\`\`

⏰ *Time:* ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}

---

Harap segera periksa dan perbaiki plugin ini agar bot berjalan lancar.`;
          await conn.sendMessage(global.ownerBot, { text: pesanError });
        }
      }
      return;
    }

    // Import module plugin
    try {
      const module = await import(`${global.__filename(dir)}?update=${Date.now()}`);
      global.plugins[filename] = module.default || module;

      // Jika sukses reload, hapus dari daftar error reported
      if (global.pluginsErrorReported.has(filename)) {
        global.pluginsErrorReported.delete(filename);
      }
    } catch (e) {
      if (!global.pluginsErrorReported.has(filename)) {
        global.pluginsErrorReported.add(filename);

        conn.logger.error(`error require plugin '${filename}'\n${e.stack || e.message}`);
        if (global.ownerBot) {
          const pesanError = `❌ *Plugin Import Error*

📂 *File:* \`${filename}\`

⚠️ *Error Message:*
\`\`\`
${e.message}
\`\`\`

⏰ *Time:* ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}

---

Harap segera periksa dan perbaiki plugin ini agar bot berjalan lancar.`;
          await conn.sendMessage(global.ownerBot, { text: pesanError });
        }
      }
    } finally {
      global.plugins = Object.fromEntries(
        Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b))
      );
    }
  }
};



// Buat instance Chokidar watcher
const watcher = chokidar.watch(pluginFolder, {
ignored: /(^|[\/\\])\../, // ignore dotfiles
persistent: true,
depth: 99, // Tentukan kedalaman rekursi
awaitWriteFinish: {
stabilityThreshold: 2000,
pollInterval: 100,
},
});

// Tambahkan event listener untuk memantau perubahan
watcher.on("all", (event, path) => {
// Panggil fungsi reload jika file yang berubah adalah file JavaScript
if (event === "change" && path.endsWith(".js")) {
const filename = path.split("/").pop(); // Dapatkan nama file dari path
global.reload(null, filename); // Panggil fungsi reload dengan null untuk _ev dan nama file
}
});

Object.freeze(global.reload);
watch(pluginFolder, global.reload);

return conn;
};




connectToWhatsApp();


process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.stack || err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Promise Rejection!');
  console.error(reason instanceof Error ? reason.stack : reason);
});

process.on('warning', (warning) => {
  console.warn('⚠️ Warning:', warning.name);
  console.warn(warning.message);
  console.warn(warning.stack);
});

/*
process.on("uncaughtException", function (err) {
let e = String(err);
if (e.includes("Socket connection timeout")) return;
if (e.includes("rate-overlimit")) return;
if (e.includes("Connection Closed")) return;
if (e.includes("Timed Out")) return;
if (e.includes("Value not found")) return;
console.log("Caught exception: ", err);
});

process.on("warning", (warning) => {
console.warn(warning.name); // Cetak nama peringatan
console.warn(warning.message); // Cetak pesan peringatan
console.warn(warning.stack); // Cetak stack trace
});
*/

// kode bot lainnya...
