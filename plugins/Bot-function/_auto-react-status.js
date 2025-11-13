export async function before(m, { conn }) {
const setBot = db.data.settings.settingbot || {}
if (m.key.remoteJid != 'status@broadcast') return
if (!setBot.viewStory) return
conn.readMessages([m.key])
if(setBot.viewStory === undefined) setBot.viewStory = false

if (setBot.reactStory){
await sleep(5000)
await conn.sendMessage(m.key.remoteJid, { react: { text: await emoji(), key:  m.key } }, { statusJidList: [m.key.participant, m.sender] })
}

}

async function emoji() {
let emo = [
"😀", "😂", "😍", "🥺", "😎", "😢", "😡", "😱", "👍",
"👏",  "🙏", 
];
    
let randomIndex = Math.floor(Math.random() * emo.length);
return emo[randomIndex];
}