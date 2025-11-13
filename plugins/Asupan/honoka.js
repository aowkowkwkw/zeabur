import downloadMedia from '../../lib/downloader.js'

const asupan = [
  "https://www.instagram.com/reel/DJiRikPTWFJ/?igsh=bWFldTA2dHdnbHI=",
  "https://www.instagram.com/reel/DJYK0tpzgUL/?igsh=bmd2NXJ5MGFlMTJp",
  "https://www.instagram.com/reel/DJWMCU-zA3K/?igsh=OTZuODdyZjRtZG83",
  "https://www.instagram.com/reel/DJRFCpjzKzx/?igsh=YmJycXRqYXhuaDYw",
  "https://www.instagram.com/reel/DJQXjJyzEqW/?igsh=cTJnN3VjMnpnYXc5",
  "https://www.instagram.com/reel/DI2f1baTGHe/?igsh=MWwzbjZzcHdsZHN2cg==",
  "https://www.instagram.com/reel/DI0Cu5Oz7N4/?igsh=MTdlanBsNDQ0MHY2OA==",
  "https://www.instagram.com/reel/DIu2ZHwzwnM/?igsh=bDU3aHYxeGN6Y3Ux",
  "https://www.instagram.com/reel/DIgJeeBBBem/?igsh=cGp6anFudG1lZ29r",
  "https://www.instagram.com/reel/DIdGWaaz_iW/?igsh=bDdyYmh3Y2p1c2dz",
  "https://www.instagram.com/reel/DIa9frATIh1/?igsh=MXBuYXR6M3U4cGhvbA==",
  "https://www.instagram.com/reel/DIaeLU6TW5n/?igsh=amlkNTNsN2lqb2oz",
  "https://www.instagram.com/reel/DH8OqiozTGA/?igsh=ampsYmt4YnYyN21z",
  "https://www.instagram.com/reel/DH2I2h7T_nJ/?igsh=MXd2N3Y5c3U4OW93cg==",
  "https://www.instagram.com/reel/DHkMn7Mzl-g/?igsh=MWthbDM5MHdmMzh5ag==",
  "https://www.instagram.com/reel/DD4RI8ZTFVg/?igsh=MW11bmp1b3ZjbmdxMQ=="
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
  handler.command = ['honoka']
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
  