import { ttdl } from 'ruhend-scraper'


let handler = async (m, { command, q, conn, prefix, setReply }) => {
  if (!q || !q.startsWith("https://") || !q.includes('tiktok'))
    return setReply(
      `Linknya?\nContoh: ${
        prefix + command
      } https://vt.tiktok.com/ZSjn1h8my/`
    );
  setReply(mess.wait);


/*
  const { alldl } = require('rahad-all-downloader');

  const videoUrl = q; // Insert a supported URL from YouTube, Facebook, TikTok, Instagram, Twitter, threads, google Drive, or Capcut.
  
  async function downloadVideo(url) {
    try {
      const result = await alldl(url);
      return result
      //console.log(result);// all response same
    } catch (error) {
      console.error('Error:', error.message);
    }
  }
  
  let data = await downloadVideo(videoUrl);
  log(data)
log(data.data.videoUrl)
conn.sendMessage(m.chat, { video: { url:data.data.videoUrl } }, { quoted: m });
*/




const url = q
let { title, author, username, published, like, comment, share, views, bookmark, video, cover, music, video_hd,profilePicture } = await ttdl(url)
//let data = await ttdl(url)
//console.log(data)


let text = transformText(`   
*TIKTOK DOWNLOADER*

Judul: ${title}
Author: ${author}
Username: ${username}
Comment: ${comment}
Views: ${views}
Like: ${like}
Published: ${published}
`)

conn.sendMessage(m.chat, { caption: text,video: { url:video } }, { quoted: m });

/*
results JSON
{ title, author, username, published, like, comment, share, views, bookmark, video, cover, music, profilePicture }
*/


};
handler.help = ["instagram"];
handler.tags = ["downloader"];
handler.command =['tt','tiktok']

export default handler;



