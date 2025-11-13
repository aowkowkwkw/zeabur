import downloadMedia from '../../lib/downloader.js'

const asupan = [
    "https://www.instagram.com/reel/DGS5g3ES-lC/?igsh=MXNpeXowY2J3cnljNQ==",
    "https://www.instagram.com/reel/DEjos-SJY6O/?igsh=MWdtMGd2amRhYXNl",
    "https://www.instagram.com/reel/DFtl0BRyEQ7/?igsh=MXB4djIzMDFhMWh3cQ==",
    "https://www.instagram.com/reel/DCOtjncSEam/?igsh=MWppYTRrbmZjZjUwbw==",
    "https://www.instagram.com/reel/DBgjSlzydoU/?igsh=Y3BpM3Q4ZXR3cW5v",
    "https://www.instagram.com/reel/C-jzKlEy_WK/?igsh=YXptYW82cXc3bXhi",
    "https://www.instagram.com/reel/C-HQY-0yoN0/?igsh=MTc2aTExbXphMmx0ag==",
    "https://www.instagram.com/reel/C8v2ki2SNpM/?igsh=MWl0c2liMTczeXFncw==",
    "https://www.instagram.com/reel/C6m0mtzhdgh/?igsh=c2xvOGNwd3dkOXkx",
    "https://www.instagram.com/reel/C6WcU4pp1fB/?igsh=MWVnZ21nb2ZjNjBnMA==",
    "https://www.instagram.com/reel/C6JeVvRJzwX/?igsh=NWszNXNyY2FiN2s=",
    "https://www.instagram.com/reel/C54temAJd6R/?igsh=OHN1aDZiaWN3NjEz",
    "https://www.instagram.com/reel/C503DIsLIFh/?igsh=NzFsNXJqcHE2ajdo"
  ];;
  
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
  handler.command = ['reemar']
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
  