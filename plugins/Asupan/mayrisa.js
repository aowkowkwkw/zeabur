import downloadMedia from '../../lib/downloader.js'

const asupan = [
  "https://www.instagram.com/reel/DJeKsuEJcZz/?igsh=MTd2ZGNiZ2hmdXFzcA==",
  "https://www.instagram.com/reel/DJYVZSlx9bK/?igsh=MWcxaDE2ZnEwdmpiMQ==",
  "https://www.instagram.com/reel/DJUBeZpJdMz/?igsh=cGtjY2Ixd2J0ajFq",
  "https://www.instagram.com/reel/DJTQeJ-Rh3Z/?igsh=MW5iZzNwdGlhdDF3MA==",
  "https://www.instagram.com/reel/DJRjJeLpqWl/?igsh=MWl4cW9vNWNqcmh3eQ==",
  "https://www.instagram.com/reel/DJPFzSoyg5e/?igsh=YXBybnNmOTBsMmcx",
  "https://www.instagram.com/reel/DJLsdCYxdf8/?igsh=MWl2aW9xZmF6aHBobw==",
  "https://www.instagram.com/reel/DJJzmejzK3C/?igsh=Mzg0NG05NDFrbzV1",
  "https://www.instagram.com/reel/DJJf1I2Jd40/?igsh=MTRqc2NzdHJyZzBvdw==",
  "https://www.instagram.com/reel/DJCfLGxTV-u/?igsh=MzBmemRwN3IwaTVn",
  "https://www.instagram.com/reel/DJB8aP8J9bQ/?igsh=N3MxbDRyY2hodW11",
  "https://www.instagram.com/reel/DI9DJ6DT8QK/?igsh=MW5kN2Rjb3U4ZXNzaQ==",
  "https://www.instagram.com/reel/DI592_OpmLF/?igsh=MTV5bHBnb3RlbXQwMQ==",
  "https://www.instagram.com/reel/DIyjPpazRQ-/?igsh=NzkyM3hubXFlNG1j",
  "https://www.instagram.com/reel/DIwLjPeh9Ig/?igsh=MWxqYjR2YmIyZmFmdA==",
  "https://www.instagram.com/reel/DIvnII1p4N5/?igsh=MWNibnJ5YndxeDZjdg=="
];

  
  
  // Langsung shuffle pertama kali
  let shuffledAsupan = shuffle([...asupan])
  
  let handler = async (m, { conn,setReply }) => {
    setReply(mess.wait)
    if (shuffledAsupan.length === 0) shuffledAsupan = shuffle([...asupan])
    let selected = shuffledAsupan.shift()
    const result = await downloadMedia(selected);
    let data = await result.data;


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

  }
  
  handler.help = ['asupan']
  handler.tags = ['random']
  handler.command = ['mayrisa']
  handler.limit = true
 
  
  export default handler
  
  // Fisher-Yates Shuffle
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
  }
  