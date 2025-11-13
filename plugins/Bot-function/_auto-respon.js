  import natural from 'natural'
 import stringSimilarity from '../../modules/stringSimilarity.js'

const tokenizer = new natural.WordTokenizer()
const EXPIRE_MS = 5 * 60 * 1000


global.__ajarRespon ||= {}

function cleanExpiredAjarRespon() {
  let now = Date.now()
  for (let sender in global.__ajarRespon) {
    if (now - global.__ajarRespon[sender].timestamp > EXPIRE_MS) {
      delete global.__ajarRespon[sender]
    }
  }
}


 let handler = (m) => m;
handler.before = async function (m, { conn, command, q, prefix, isAccept }) {
  const chat = global.db.data.chats[m.chat];
  const numberQuery = q.replace(new RegExp("[()+-/ +/]", "gi"), "") + `@s.whatsapp.net`
  const Input = m.isGroup? m.mentionByTag[0]? m.mentionByTag[0] : m.mentionByReply ? m.mentionByReply : q? numberQuery : false : false
  const isSticker = m.type == "stickerMessage";
  const isCmd = m.body.startsWith(prefix);
  const allcommand = db.data.allcommand;
  const replyCommand = isCmd? isCmd : allcommand.includes(toFirstCase(command));
  const isAudio = m.type == "audioMessage";

  const isReplySticker =  m.type === "stickerMessage" && m.content.includes("stickerMessage");
  const isQuotedReplySticker = m.type === "stickerMessage" && m.content.includes("extendedTextMessage");
  const mentionByReplySticker = m.type == "stickerMessage" && m.message.stickerMessage.contextInfo != null ? m.message.stickerMessage.contextInfo.participant || "" : "";
 
  if (
    (m.isGroup && //di dalam group
      chat.simi && //fitur simi di aktifkan
      Input == m.botNumber && //jika user input nomer bot
      !replyCommand && //jika user memakai fitur bot tidak akan merespon
      !isAudio && //jika audio yang direply bot tidak akan merespm
      !isAccept &&
      !allcommand.includes(toFirstCase(command))) ||
    (m.isGroup &&
      chat.simi &&
      mentionByReplySticker == m.botNumber &&
      isSticker &&
      !replyCommand) ||
    (m.isGroup &&
      chat.simi &&
      (m.body.toLowerCase().includes(botName.toLowerCase()) ||
       m.body.toLowerCase().includes(botName.toLowerCase().substring(0, 3)))) ||  
      (!m.isGroup && (m.body.toLowerCase().includes(botName.toLowerCase()) ||
       m.body.toLowerCase().includes(botName.toLowerCase().substring(0, 3)))) 
  ) {

//if (m.fromMe) return
// agar bot tidak merespon saat user main game
if (Object.keys(conn.game).some(key => key.includes(m.chat))) return




    //Bot gayanya sedang mengetik
    await conn.sendPresenceUpdate("composing", m.chat);

    if (isQuotedReplySticker || isReplySticker) {
      await sleep(2000);
      if(db.data.stickerBot == {}) {return}
      let namastc = Object.keys(db.data.sticker).getRandom();
      if(db.data.sticker[namastc]) conn.sendMessage(m.chat, {sticker: {url:db.data.sticker[namastc].link}}, {quoted:m })
    } else {
  
    const delayTime = Math.min(5000,Math.max(2000, m.text.length * 50))
    await sleep(delayTime);
    let violetName = m.text.toLowerCase().includes(botName.toLowerCase()) 
    let vioName = m.text.toLowerCase().includes(botName.toLowerCase().substring(0, 3))

      let userAnswer = m.mentionByTag? m.text.replace(m.mentionByTag, "") : violetName? m.text.replace(violetName, "") : vioName? m.text.replace(vioName, "") : m.text
      let kato = ["Kenapa ?","Ha ?","napa ?","ya ?","apa ?","Hmm ?"];
      let acak = kato.getRandom();
      if (m.mentionByTag[0] == conn.user.jid ||
         (m.body.toLowerCase() == botName.toLowerCase() ||
          m.body.toLowerCase() == botName.toLowerCase().substring(0, 3)) ) return conn.sendMessage(m.chat, { text: acak }, { quoted: m });
    
    let input = userAnswer.toLowerCase().replace(/[^\w\s]/gi, '')
    //if (input.length > 200) return



 


    let inputTokens = tokenizer.tokenize(input)
    let terbaik = { skor: 0, pertanyaan: null }
    for (let pertanyaan in db.data.respon) {
      let pTokens = tokenizer.tokenize(pertanyaan.toLowerCase())
      let jarak = natural.JaroWinklerDistance(inputTokens.join(' '), pTokens.join(' '))
      if (jarak > terbaik.skor) {
        terbaik = { skor: jarak, pertanyaan }
      }
    }

    if (terbaik.skor >= 0.75 || terbaik.skor >= 0.75 && (violetName||vioName)) {
      let jawabanList = db.data.respon[terbaik.pertanyaan]
      if (!Array.isArray(jawabanList) || jawabanList.length === 0) return
      let jawaban = jawabanList[Math.floor(Math.random() * jawabanList.length)]
      return conn.reply(m.chat, jawaban, m)
    }


  if (global.classifier && global.classifier.docs.length > 0) {
  let label = global.classifier.classify(input)
  let responses = global.db.data.respon?.[label]
  if (Array.isArray(responses) && responses.length) {
    let reply = responses[Math.floor(Math.random() * responses.length)]
    return m.reply(reply)
  }
}




    cleanExpiredAjarRespon()

    global.__ajarRespon[m.sender] = {
      text: input,
      timestamp: Date.now()
    }

    return conn.reply(m.chat, `Aku masih belum ngerti maksud dari\nPertanyaan: "${m.text}" 🤔\n\nBantu aku belajar untuk menjawab pertanyaan ini dong kaa\n\nKetik: *.ajar <jawaban>*`, m)
 












































     
 


    

 
      

 

    
      
    



    }
  }
};
export default handler;
