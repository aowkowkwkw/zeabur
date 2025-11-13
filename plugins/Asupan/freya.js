import downloadMedia from '../../lib/downloader.js'

const freyaReels = [
  "https://www.instagram.com/reel/DD0XgOzzVqo/?igsh=MTg1dmI0NGxocm1vbQ==",
  "https://www.instagram.com/reel/DJ2i8MCzicl/?igsh=MTkyaXRubTJtdDVxNQ==",
  "https://www.instagram.com/reel/DJYMW7Gp8fG/?igsh=ZW50dWpoNTZ4dWF1",
  "https://www.instagram.com/reel/DJq56wRB0vV/?igsh=ampvYnd3eHNmdDh4",
  "https://www.instagram.com/reel/DC6WRDwTCzc/?igsh=N2xjdGJyM2E4czBq",
  "https://www.instagram.com/reel/DD1sIB2Shm_/?igsh=ZHNocjZ2ODBvdmt3",
  "https://www.instagram.com/reel/DDvpm8ih4Je/?igsh=MWVobDFyOW5mdHhweA==",
  "https://www.instagram.com/reel/DItcohnzuqj/?igsh=MXh3bTM5YWh0cWllcA==",
  "https://www.instagram.com/reel/DJlv-bLh0Jg/?igsh=MWd2Z2t6OXQxMzl2dw==",
  "https://www.instagram.com/reel/DJQpS3fz4Jh/?igsh=Y3VpcTY4ejc3cTd1",
  "https://www.instagram.com/reel/DHhNoRzT4vb/?igsh=N284Z3A0NHBqZmJr",
  "https://www.instagram.com/reel/DJhBsqmSid6/?igsh=MThnbXo3cmJvMWM4cQ==",
  "https://www.instagram.com/reel/DIz0xb1THIZ/?igsh=aXdubDV0ZmFhM2w2",
  "https://www.instagram.com/reel/DKESzBvTt2v/?igsh=b2Q2Y3Brb2Q2bWtz",
  "https://www.instagram.com/reel/DIV3dShS4wr/?igsh=MTQ2bTExa2J1eHJ5cA==",
  "https://www.instagram.com/reel/DHmUyOAhOu9/?igsh=MWZqdTI4OHliODVpOQ==",
  "https://www.instagram.com/reel/DJ3tpTOvvz0/?igsh=c2F4bnYxY3Nob2Ft",
    "https://www.instagram.com/reel/DKO42e8yBp8/?igsh=MWI4YmlpMmUyM2NlNQ==",
  "https://www.instagram.com/reel/DKQnccbTq4l/?igsh=MWFsajh2cmxoMGp1MQ==",
  "https://www.instagram.com/reel/DINCsouzREt/?igsh=bDZoOXpuMzEyYmFy",
  "https://www.instagram.com/reel/DJZZ_pIh2oJ/?igsh=NmlxdTZtNXdqYWE2",
  "https://www.instagram.com/reel/DITWxOPBqAt/?igsh=eW13b3EzaDc0bXRn",
  "https://www.instagram.com/reel/DKRR7XqT6dG/?igsh=bXF1d25tc2UxY2Jm",
  "https://www.instagram.com/reel/DJf98FLz9dd/?igsh=N3dnNWhheGNoMDE1",
  "https://www.instagram.com/reel/DJY0e-mpNLB/?igsh=MXZrbHFrbnVxYXNucg==",
  "https://www.instagram.com/reel/DJ2z7fxym8k/?igsh=MXNqbnd6OTU2MXR0YQ==",
  "https://www.instagram.com/reel/DIQZFtsSWvK/?igsh=MWVjMW1jMjgyNTlwYQ=="
];

  
  
  // Langsung shuffle pertama kali
  let shuffledAsupan = shuffle([...freyaReels])
  
  let handler = async (m, { conn,setReply }) => {
    setReply(mess.wait)
    if (shuffledAsupan.length === 0) shuffledAsupan = shuffle([...freyaReels])
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
  handler.command = ['freya']
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
  