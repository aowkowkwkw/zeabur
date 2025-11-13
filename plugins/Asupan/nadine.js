import downloadMedia from '../../lib/downloader.js'

const asupan = [
    "https://www.instagram.com/reel/DHillWGzrKB/?igsh=MWcwdjI1M2I5djRxZg==",
    "https://www.instagram.com/reel/DJMAQuqRvRg/?igsh=MTFicWZhaG1sOHdjag==",
    "https://www.instagram.com/reel/DIqW76pxjHK/?igsh=dHZoZWQydHNkN2x1",
    "https://www.instagram.com/reel/DIgO-tNTIrR/?igsh=eXRpZ3pmYmk3aWZn",
    "https://www.instagram.com/reel/DIV8Tr5Twhi/?igsh=M2tncGdpMmZib2x6",
    "https://www.instagram.com/reel/DITd7dTzviA/?igsh=aGwydnJwZWI4cHQw",
    "https://www.instagram.com/reel/DHf0jDiR_km/?igsh=M2R6dDE5b3ZtcG43",
    "https://www.instagram.com/reel/DHdhB8RzDZ5/?igsh=eGg4OGRpMXZwZnVt",
    "https://www.instagram.com/reel/DHa47BZTnyg/?igsh=YXdoejRzYWU3NGU3",
    "https://www.instagram.com/reel/DHLPD2LT_X4/?igsh=bzE3MHUxMnJ4OTFn",
    "https://www.instagram.com/reel/DHIlPYMRNVs/?igsh=MWw3MXFpajFvZm85eg==",
    "https://www.instagram.com/reel/DHDjPh9T0AI/?igsh=bnlrY2dka2pzczhq",
    "https://www.instagram.com/reel/DGsNSaQx26R/?igsh=MXdtNTJ6cmtwbXU3OQ==",
    "https://www.instagram.com/reel/DGqLltwz8Lx/?igsh=NWRpdzBsaXg1cWtn",
    "https://www.instagram.com/reel/DGX8HWmTOKm/?igsh=NXo4eGJ0Z2RkZmtx",
    "https://www.instagram.com/reel/DGApAbrT-zk/?igsh=YmpndW5vOGQ2NDVh",
     "https://www.instagram.com/reel/DIWQryYymoR/?igsh=MTFjZnN2ZnJ1ZWd4eA==",
    "https://www.instagram.com/reel/DIoKG0OSENP/?igsh=MXV5YXU5aDF4N2R2bw==",
    "https://www.instagram.com/reel/DE7UUd9zYWl/?igsh=MWlrcG1zanF0MW1xbw==",
    "https://www.instagram.com/reel/DJLfyhYS5Sg/?igsh=MXAzeXA3Mmo1ZXlhbw=="
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
  handler.command = ['nadine']
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
  