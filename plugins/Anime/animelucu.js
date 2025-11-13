import downloadMedia from '../../lib/downloader.js'

const asupan = [
  "https://www.instagram.com/reel/DHXdZVvqm9W/?igsh=bzg0c29tamxta29v",
  "https://www.instagram.com/reel/DHWFnhKutpc/?igsh=MTZ6dXl2aXEyeDJpOQ==",
  "https://www.instagram.com/reel/DFXb8-ENqU4/?igsh=MXAxNHV0dXhzMWdkag==",
  "https://www.instagram.com/reel/DFO0zoIqhNv/?igsh=MXZyeW5xd3RudWFvcQ=="
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
  
  
  handler.tags = ['random']
  handler.command = ['animelucu']
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
  