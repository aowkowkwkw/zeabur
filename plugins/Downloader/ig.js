 
let handler = async (m, { command, q, conn, prefix, setReply }) => {
  if (!q || !q.startsWith("https"))
    return setReply(
      `Linknya?\nContoh: ${
        prefix + command
      } https://www.instagram.com/p/CKXZ1Z1JZK/`
    );
  setReply(mess.wait);



  const { igdl } = require('ruhend-scraper')
  const text = q
  
  let res = await igdl(text);
  let data = await res.data;
  
     for (let media of data) {
        new Promise(resolve => setTimeout(resolve, 2000));
        //console.log(media.url)
       if(media.url .startsWith('https://d.rapidcdn.app')){
        conn.sendMessage(m.chat, { video: { url:media.url }  }, { quoted: m });
       } else conn.sendMessage(m.chat, { image: { url:media.url }  }, { quoted: m });

        /* media.url is or are link of videos or images that just one by one
         * or do something with your project
         */
     }
//log(data)
//conn.sendMessage(m.chat, { video: { url:data.data.videoUrl }  }, { quoted: m });








 


};
handler.help = ["instagram"];
handler.tags = ["downloader"];
handler.command =['ig']

export default handler;



