import { ttdl } from 'ruhend-scraper'


let handler = async (m, { command, q, conn, prefix, setReply }) => {
  if (!q || !q.startsWith("https://") || !q.includes('tiktok'))
    return setReply(
      `Linknya?\nContoh: ${
        prefix + command
      } https://vt.tiktok.com/ZSjn1h8my/`
    );
  setReply(mess.wait);


 


const url = q
let { title, author, username, published, like, comment, share, views, bookmark, video, cover, music, video_hd,profilePicture } = await ttdl(url)
//let data = await ttdl(url)
//console.log(data)



conn.sendMessage(m.chat, { music: { url:music } }, { quoted: m });

 


};
  

handler.help = ["downloader"];
handler.tags = ["internet"];
handler.command = ["ttaudio","ttmp3","tiktokaudio","tiktokmusik"];

export default handler;



