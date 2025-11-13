import downloadMedia from '../../lib/downloader.js'

const asupan = [
  "https://www.instagram.com/reel/DC6sFkCzyAk/?igsh=MW5oNnc5ZmQ0MjNueg==",
  "https://www.instagram.com/reel/DGb1ZZVS5vI/?igsh=MXh3Zmx4c2F3ejVwMw==",
  "https://www.instagram.com/reel/DFqbxWgiI0-/?igsh=MWg2MDRzamZlcGQxOQ==",
  "https://www.instagram.com/reel/DJWpN_Oz9F7/?igsh=MThwcXVzeThpMjE2NA==",
  "https://www.instagram.com/reel/DJiD7SWTPjy/?igsh=MXY1bDE4OGhidTlxYg==",
  "https://www.instagram.com/reel/DISFpaUTgyv/?igsh=MWI3bnJ5Ym9jbHJmbA==",
  "https://www.instagram.com/reel/DIPZFWWotbW/?igsh=MXdheTRiaGVrYWdxbA==",
  "https://www.instagram.com/reel/DIIzc5ezvOt/?igsh=a295bndkeDRsajFq",
  "https://www.instagram.com/reel/DH-gueszqU-/?igsh=MXFibjhjZjZhd3d2OQ==",
  "https://www.instagram.com/reel/DH3zYnAoKZW/?igsh=dnE1ZXhvdTJ6MWV6",
  "https://www.instagram.com/reel/DHz3V_VzduB/?igsh=MWp5djRkb3pxZGJtcA==",
  "https://www.instagram.com/reel/DF2uRfpIAZe/?igsh=M2w1NDJ3ZDl2bGJh",
  "https://www.instagram.com/reel/DJjbun9yaPL/?igsh=dXNwdWFlNGR0NWh6",
  "https://www.instagram.com/reel/DHg2n70NWqw/?igsh=aGw3OGVmNjN1d2Ru",
  "https://www.instagram.com/reel/DHIGOWcIZI8/?igsh=ZjVmNDU0YjJsNTVp",
  "https://www.instagram.com/reel/DHg1i9RNveV/?igsh=MXAwZ2NrbnQwMDFlNg=="
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
  handler.command = ['sololeveling']
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
  