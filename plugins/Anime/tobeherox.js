import downloadMedia from '../../lib/downloader.js'

const tobeherox = [
  "https://www.instagram.com/reel/DIWZFe7o_9N/?igsh=emVheWowMjhtMG40",
  "https://www.instagram.com/reel/DDHwGTnolgf/?igsh=c2Y5dTZuMDU5YnA2"
];



  
  
  // Langsung shuffle pertama kali
  let shuffledAsupan = shuffle([...tobeherox])
  
  let handler = async (m, { conn,setReply }) => {
    setReply(mess.wait)
    if (shuffledAsupan.length === 0) shuffledAsupan = shuffle([...tobeherox])
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
  handler.command = ['tobeherox']
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
  