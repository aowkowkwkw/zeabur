
let handler = async (m, { command, q, conn, prefix, setReply }) => {
  if (!q || !q.startsWith("https"))
    return setReply(
      `Linknya?\nContoh: ${
        prefix + command
      } https://www.instagram.com/p/CKXZ1Z1JZK/`
    );
  setReply(mess.wait);




  const { fbdl } = require('ruhend-scraper')

const text = q

let res = await fbdl(text);
let data = await res.data;
//console.log(res); 
//or
//console.log(data); 
const url = 
  data.find(item => item.resolution.includes('720p'))?.url || 
  data.find(item => item.resolution.includes('360p'))?.url;
conn.sendMessage(m.chat, { video: { url } }, { quoted: m });


 

};
handler.help = ["instagram"];
handler.tags = ["downloader"];
handler.command = ['fb']

export default handler;



