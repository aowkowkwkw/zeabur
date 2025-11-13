import { createRequire } from "module";
import { fileURLToPath } from "url";
import fs from 'fs-extra'
import chalk from './modules/chalk.js';
const require = createRequire(import.meta.url);
const version = require("baileys/package.json").version;
import stringSimilarity from './modules/stringSimilarity.js'
 

//======== OWNER SETTINGS =======\\
global.nomerOwner = "628515088173";
global.nomerOwner2 = "628573335908";
global.ownerPhoto = '' // photo owner
global.nomerBot = "6285179757983"
global.ownerName = "Lala"; 
global.gender = 'Boys'  
global.agama = 'Islam' 
global.tanggalLahir = '17/12/2000' // contoh '25/11/1993'
global.hobi = 'ngoding'
global.sifat ='tukang satir'
global.tempatTinggal = 'Magelang-Jogja'
global.waifu = 'Megawati'

     
//======= BOT SETTINGS ======\\
global.pairingCode = true // true / false
global.botName = "Violet"
global.session = "session" 
global.runWith = "DIgital Ocean 🐋"
global.antiSpam = true
global.fake = botName
global.print = true //menampilkan pesan di log
global.copyright = `© ${botName}`
global.packName = "Violet"
global.authorName = ''
global.ownerBot = `${nomerOwner}@s.whatsapp.net`
global.limitCount = 15;
global.gameCount = 30
global.Intervalmsg = 2000; //detik
global.mongodb = ""
global.dbName = "extream"
global.myUrl = "https://wa.me/c/6285953938243"
global.newsletterJid = "120363249625006239@newsletter"
global.newsletterName = "VIOLET INFO"



 

global.fotoRandom = [
  "https://telegra.ph/file/63e8a49b86824c3402c2a.jpg",
];


 
global.fileStackApi = "AlDgaKtdiT1iL6CwlXMpWz"; //daftar di filestack.com,api untuk menyimpan file
global.apiflash = "39fc26a0f40048eb838b8c35e0789947"; //
global.goFileApi = 'tBe1uKKCxI2decUBIf2JsjiD5O7hgzQ4'
global.serApi = '230f61aac12e54b5585a893d729079b451e02a672a3bd17ef42f7bc7c9385182'



 

/*============== EMOJI ==============*/
global.rpg = {
  emoticon(string) {
    string = string.toLowerCase();
    let emot = {
      level: "📊",
      limit: "🎫",
      health: "❤️",
      stamina: "⚡",
      exp: "✨",
      atm: "💳",
      money: "💰",
      bank: "🏦",
      potion: "🥤",
      diamond: "💎",
      rawdiamond: "💠",
      common: "📦",
      uncommon: "🛍️",
      mythic: "🎁",
      legendary: "🗃️",
      superior: "💼",
      pet: "🔖",
      trash: "🗑",
      armor: "🥼",
      sword: "⚔️",
      pickaxe: "⛏️",
      axe: "🪓",
      fishingrod: "🎣",
      kondom: "🎴",
      coal: "⬛",
      wood: "🪵",
      rock: "🪨",
      string: "🕸️",
      horse: "🐴",
      cat: "🐱",
      dog: "🐶",
      fox: "🦊",
      robo: "🤖",
      dragon: "🐉",
      petfood: "🍖",
      iron: "⛓️",
      rawiron: "◽",
      gold: "🪙",
      rawgold: "🔸",
      emerald: "❇️",
      upgrader: "🧰",
      bibitanggur: "🌱",
      bibitjeruk: "🌿",
      bibitapel: "☘️",
      bibitmangga: "🍀",
      bibitpisang: "🌴",
      anggur: "🍇",
      jeruk: "🍊",
      apel: "🍎",
      mangga: "🥭",
      pisang: "🍌",
      botol: "🍾",
      kardus: "📦",
      kaleng: "🏮",
      plastik: "📜",
      gelas: "🧋",
      chip: "♋",
      umpan: "🪱",
      skata: "🧩",
      defense: "🛡️",
      strength: "💪🏻",
      speed: "🏃",
      tbox: "🗄️",
    };
    let results = Object.keys(emot)
      .map((v) => [v, new RegExp(v, "gi")])
      .filter((v) => v[1].test(string));
    if (!results.length) return "";
    else return emot[results[0][0]];
  },
};



//============================================\\




async function similarity(one,two) {
const treshold = stringSimilarity.compareTwoStrings(one, two)
return treshold.toFixed(2)
}


async function reloadFile(file) {
file = file.url || file;
let fileP = fileURLToPath(file);
fs.watchFile(fileP, () => {
fs.unwatchFile(fileP);
console.log(
chalk.bgGreen(chalk.black("[ UPDATE ]")),
chalk.white(`${fileP}`)
);
import(`${file}?update=${Date.now()}`);
});
}

reloadFile(import.meta.url);


function transformText(text) {
  const charMap = {
    'A': 'ᴀ', 'B': 'ʙ', 'C': 'ᴄ', 'D': 'ᴅ', 'E': 'ᴇ', 'F': 'ғ', 'G': 'ɢ', 'H': 'ʜ', 'I': 'ɪ',
    'J': 'ᴊ', 'K': 'ᴋ', 'L': 'ʟ', 'M': 'ᴍ', 'N': 'ɴ', 'O': 'ᴏ', 'P': 'ᴘ', 'Q': 'ǫ', 'R': 'ʀ',
    'S': 's', 'T': 'ᴛ', 'U': 'ᴜ', 'V': 'ᴠ', 'W': 'ᴡ', 'X': 'x', 'Y': 'ʏ', 'Z': 'ᴢ',
    '0': '𝟶', '1': '𝟷', '2': '𝟸', '3': '𝟹', '4': '𝟺', '5': '𝟻', '6': '𝟼', '7': '𝟽', '8': '𝟾', '9': '𝟿'
  };

  return text.toUpperCase().split('').map(char => {
    return charMap[char] || char;
  }).join('');
}

function transformText2(text) {
  const charMap = {
    'A': 'ᴀ', 'B': 'ʙ', 'C': 'ᴄ', 'D': 'ᴅ', 'E': 'ᴇ', 'F': 'ғ', 'G': 'ɢ', 'H': 'ʜ', 'I': 'ɪ',
    'J': 'ᴊ', 'K': 'ᴋ', 'L': 'ʟ', 'M': 'ᴍ', 'N': 'ɴ', 'O': 'ᴏ', 'P': 'ᴘ', 'Q': 'ǫ', 'R': 'ʀ',
    'S': 's', 'T': 'ᴛ', 'U': 'ᴜ', 'V': 'ᴠ', 'W': 'ᴡ', 'X': 'x', 'Y': 'ʏ', 'Z': 'ᴢ',
    '0': '𝟶', '1': '𝟷', '2': '𝟸', '3': '𝟹', '4': '𝟺', '5': '𝟻', '6': '𝟼', '7': '𝟽', '8': '𝟾', '9': '𝟿'
  };

  return text.split('').map(char => {
    return charMap[char.toUpperCase()] || char;
  }).join(' ');
}


 


 


function getRandomFile (ext){
  return `${Math.floor(Math.random() * 10000)}${ext}`;
};

 function makeid(length){
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};



async function totalCase(filePath, command) {
  try {
    const data = await fs.readFile(filePath, 'utf8');

    let found = false;
    const lines = data.split('\n');
    lines.forEach((line) => {
      const caseMatch = line.match(/case\s+['"]([^'"]+)['"]/);
      if (caseMatch && caseMatch[1] === command) {
        found = true;
      }
    });

    return found;
  } catch (err) {
    throw err;
  }
}





const toFirstCase = (str) => {
  let first = str
  .split(" ") // Memenggal nama menggunakan spasi
  .map((nama) => nama.charAt(0).toUpperCase() + nama.slice(1)) // Ganti huruf besar kata-kata pertama
  .join(" ");
  
  return first;
  }

  const sleep = async (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  
  
  function tmp(file) {
    return file + ".tmp";
    }
    
    const Log = (text) => {
      console.log(text);
      };
      
      let d = new Date();
      let locale = "id";
      let gmt = new Date(0).getTime() - new Date("1 Januari 2021").getTime();
      let week = d.toLocaleDateString(locale, { weekday: "long" });
      const calender = d.toLocaleDateString("id", {
      day: "numeric",
      month: "long",
      year: "numeric",
      });
      
      function clockString(ms) {
        let months = isNaN(ms) ? "--" : Math.floor(ms / (86400000 * 30.44));
        let d = isNaN(ms) ? "--" : Math.floor(ms / 86400000);
        let h = isNaN(ms) ? "--" : Math.floor(ms / 3600000) % 24;
        let m = isNaN(ms) ? "--" : Math.floor(ms / 60000) % 60;
        let s = isNaN(ms) ? "--" : Math.floor(ms / 1000) % 60;
        let monthsDisplay = months > 0 ? months + " bulan, " : "";
        let dDisplay = d > 0 ? d + " hari, " : "";
        let hDisplay = h > 0 ? h + " jam, " : "";
        let mDisplay = m > 0 ? m + " menit, " : "";
        let sDisplay = s > 0 ? s + " detik" : "";
        let time = months > 0 ? monthsDisplay + dDisplay : d > 0 ? dDisplay + hDisplay : h > 0 ? hDisplay + mDisplay  : mDisplay + sDisplay
      
        return time;
      }
      
      
      
      
      
     
   



global.require = require;
global.reloadFile = (file) => reloadFile(file);
global.baileysVersion = `Baileys ${version}`;
global.similarity = (one,two) => similarity(one,two);
global.transformText = transformText
global.transformText2 = transformText2
global.getRandomFile = getRandomFile
global.makeid = makeid
global.totalCase = totalCase
global.toFirstCase = toFirstCase;
global.sleep = sleep;
global.tmp = tmp;
global.clockString = clockString;
global.week = week;
global.calender = calender;
global.Log = Log;
global.log = Log;   













