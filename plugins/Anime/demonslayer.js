import downloadMedia from '../../lib/downloader.js'

const demonSlayer = [
  "https://www.instagram.com/reel/DJhTFyhIFv8/?igsh=aGR5dDFtNThpdTRx",
  "https://www.instagram.com/reel/DJXnaJYzAzL/?igsh=MTVqeHE0dW9rd2g1Nw==",
  "https://www.instagram.com/reel/DJSkdd5TnXg/?igsh=MTBwbHV3N3gzenI0bw==",
  "https://www.instagram.com/reel/DJRmFZyzjSP/?igsh=YWs5NzU1ZWlydWww",
  "https://www.instagram.com/reel/DJPyyi3IH8N/?igsh=Y21reDhiNHlpMjht",
  "https://www.instagram.com/reel/DJD7A7uTbFv/?igsh=MXd4NWt1dWQ3MmswZw==",
  "https://www.instagram.com/reel/DIo5re-Ig-3/?igsh=cnAxMXRnendibDU2",
  "https://www.instagram.com/reel/DIoC52DzAGr/?igsh=MXkxdmhqdG52c2UyYw==",
  "https://www.instagram.com/reel/DIjK1xIonfQ/?igsh=c3kwY2FlcXhxeGZv",
  "https://www.instagram.com/reel/DIhQouUIlTa/?igsh=MTdxcjU3YnlrZWRhMA==",
  "https://www.instagram.com/reel/DIYjf1xTlHc/?igsh=OHB2ajVjdTl4cms0",
  "https://www.instagram.com/reel/DIBPLyXzi6M/?igsh=cW44ZzlxYnFnbTEx",
  "https://www.instagram.com/reel/DHu4gGHTrx5/?igsh=MWQ0cWtrMmpzOG12eA=="
];

  
  
  // Langsung shuffle pertama kali
  let shuffledAsupan = shuffle([...demonSlayer])
  
  let handler = async (m, { conn,setReply }) => {
    setReply(mess.wait)
    if (shuffledAsupan.length === 0) shuffledAsupan = shuffle([...demonSlayer])
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
  handler.command = ['demonslayer']
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
  