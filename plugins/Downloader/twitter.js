
let handler = async (m, { command, q, conn, prefix, setReply }) => {
  if (!q || !q.startsWith("https"))
    return setReply(
      `Linknya?\nContoh: ${
        prefix + command
      } https://www.instagram.com/p/CKXZ1Z1JZK/`
    );
  setReply(mess.wait);


  const { twitter } = require('btch-downloader')
  const data = await twitter(q)
  const url = data.url[0].hd || data.url[1].sd
   
conn.sendMessage(m.chat, { caption: data.title, video: { url }  }, { quoted: m });




};
handler.help = ["instagram"];
handler.tags = ["downloader"];
handler.command =['twitter','tw']

export default handler;



