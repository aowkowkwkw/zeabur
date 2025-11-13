import downloadMedia from '../../lib/downloader.js'

const asupan = [
    "https://www.instagram.com/reel/DI0_YWLSi3d/?igsh=MW1hanhwbzMxaWdpeg==",
    "https://www.instagram.com/reel/DIlgh6KS29d/?igsh=MXkwa3E3NGdvdXZpNg==",
    "https://www.instagram.com/reel/DIbDA1WSQQp/?igsh=YXU0cjd3bmMxOWly",
    "https://www.instagram.com/reel/DITY2BTyO-n/?igsh=MW52ZHpubGltNzdyNA==",
    "https://www.instagram.com/reel/DILuinJSpTg/?igsh=aW8yYWh6NGRjajdz",
    "https://www.instagram.com/reel/DH0uF29ykBz/?igsh=aWVnbnA3d2tndjlj",
    "https://www.instagram.com/reel/DHtEqshyczl/?igsh=MWhhZ2NneTJjZXFtcw==",
    "https://www.instagram.com/reel/DHdRBFDy1Of/?igsh=MXI2azhtNGV6MTgxMw==",
    "https://www.instagram.com/reel/DHaxJErykXr/?igsh=bHUwOWdmMDgwcHlj",
    "https://www.instagram.com/reel/DGnVIY5SCha/?igsh=aTVvMXNsNmRoeTNr",
    "https://www.instagram.com/reel/DFFiFeDyH6G/?igsh=MW0zb252aTJpeHI1OA==",
    "https://www.instagram.com/reel/DEHulHzS1xc/?igsh=MWd5MGlqb3Y4eDluag=="
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
  handler.command = ['angelia']
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
  