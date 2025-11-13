import downloadMedia from '../../lib/downloader.js'

const waifu = [
  "https://www.instagram.com/reel/DIlizpIy2XH/?igsh=aHB2aGw0b2VzNHIz",
  "https://www.instagram.com/reel/DIlVeNDNd_w/?igsh=eHVpM3ZuamVtbXY=",
  "https://www.instagram.com/reel/DIiJ55UyCY9/?igsh=MWpncG56OXAycHBrYQ==",
  "https://www.instagram.com/reel/DIT76waNmsT/?igsh=MTAwYjFsazlwcTZycQ==",
  "https://www.instagram.com/reel/DISeinDq3NB/?igsh=bDdqdWZ0NmtsdGg4",
  "https://www.instagram.com/reel/DH-tIm4yoAt/?igsh=MWIyd29qem9pYTAwbw==",
  "https://www.instagram.com/reel/DH6D1xqNIsy/?igsh=MW0xZ2gyY3Y3czVuOQ==",
  "https://www.instagram.com/reel/DH0t-atNONx/?igsh=MWFoc3AyeTc3N2RnNw==",
  "https://www.instagram.com/reel/DHypPcdNuHh/?igsh=NXF1ZGE5eDBpZ3J6",
  "https://www.instagram.com/reel/DHxY0sUNSWG/?igsh=MXQyOWhvc3JtOTJlcA==",
  "https://www.instagram.com/reel/DHqM-gtN6HD/?igsh=MXB5NTdpY3dqY2NvZQ==",
  "https://www.instagram.com/reel/DHnJhHNt_aC/?igsh=MWM2Ym82OTNjOTJpMw==",
  "https://www.instagram.com/reel/DHcyy4mKSWk/?igsh=Mjh6eGFmc2YxZnI1",
  "https://www.instagram.com/reel/DHbY_DMtXq2/?igsh=MWplYmV3eGFkMWN6bA==",
  "https://www.instagram.com/reel/DF7yDhnyAwd/?igsh=MTFhMmhzdzVoNTl6ZA==",
  "https://www.instagram.com/reel/DF435dBNznS/?igsh=MWF6b3MydnZudjB2bg==",
  "https://www.instagram.com/reel/DFfHGh5t1US/?igsh=dWQwaGswMXZxdXMw",
  "https://www.instagram.com/reel/DFefX6vq2eL/?igsh=MXZsaXlid3J5cnRjNA==",
  "https://www.instagram.com/reel/DFcXUi3OrZl/?igsh=MTF5YWU3OTVqM281aQ==",
  "https://www.instagram.com/reel/DFScqCyOMUJ/?igsh=N2M1b3VneDlybGs1",
  "https://www.instagram.com/reel/DFMrlZ0NSHC/?igsh=MXBnczhkOXp1aThtOQ==",
  "https://www.instagram.com/reel/DDhRBacTkEn/?igsh=M3d2NjRxZjI4M2Q2",
  "https://www.instagram.com/reel/DDB2S5TNgOF/?igsh=MTNuOGxtOXBnNHBl",
  "https://www.instagram.com/reel/DHbnyG8yGQj/?igsh=MXRpNGlwdDhpZ211aw==",
  "https://www.instagram.com/reel/DEIaSOwu8Tt/?igsh=Z25zbm85Y3ZkMjhl",
  "https://www.instagram.com/reel/DEuFpmHysiY/?igsh=MXdkazY5aWI2dm93YQ==",
  "https://www.instagram.com/reel/DFZwGF0NDUH/?igsh=MWxkamF0ZmhxdDJmcw==",
  "https://www.instagram.com/reel/DC4FHnet2EQ/?igsh=MTRvNzZidzRucjRuag==",
  "https://www.instagram.com/reel/DJXNugvoVFp/?igsh=M2cxdjNhb3ZmOXJ6",
  "https://www.instagram.com/reel/DJUtqOOoZPS/?igsh=MWhlOTcycWwwZHIzMA==",
  "https://www.instagram.com/reel/DDm2SK0TCR0/?igsh=MTBrc3E2d2o4cDEzbQ==",
  "https://www.instagram.com/reel/DEQLs1VhmAX/?igsh=NndvODZoMGdiZHY1",
    "https://www.instagram.com/reel/DHnOgXQq3gF/?igsh=MXF4Y2tibzc0dm44aQ==",
  "https://www.instagram.com/reel/DC8JeOJzBrZ/?igsh=emdraXhzeHpuaTE3",
  "https://www.instagram.com/reel/DG5u3UuNAJE/?igsh=ZHNzNWlvOGlhcDBl",
  "https://www.instagram.com/reel/DEHjgOUy4D0/?igsh=MWh6amg2Z3lvcm9zYg==",
  "https://www.instagram.com/reel/DICMWmPTMz3/?igsh=MXloZDR2NXJtZ3dw",
  "https://www.instagram.com/reel/DJipZI5yu6E/?igsh=Z280dG1oZ2V2eXNk"
];


  
  
  // Langsung shuffle pertama kali
  let shuffledAsupan = shuffle([...waifu])
  
  let handler = async (m, { conn,setReply }) => {
    setReply(mess.wait)
    if (shuffledAsupan.length === 0) shuffledAsupan = shuffle([...waifu])
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
  handler.command = ['waifu']
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
  