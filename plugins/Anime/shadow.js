import downloadMedia from '../../lib/downloader.js'

const shadow = [
  "https://www.instagram.com/reel/DJj20TwIfCJ/?igsh=NjZhYzY4Zmk1NjZu",
  "https://www.instagram.com/reel/DJMrYCQIklX/?igsh=YnphcW1vMjdyd24x",
  "https://www.instagram.com/reel/DJKFExWI85b/?igsh=MWg1a2xueHdudGFscA==",
  "https://www.instagram.com/reel/DI9NsfkIyYz/?igsh=MWFpYWhhN3FqZTM1Zg==",
  "https://www.instagram.com/reel/DIyzr9DIpP2/?igsh=MXZ2MGFpMm1vOWhxaw==",
  "https://www.instagram.com/reel/DIjMbOrol5X/?igsh=ZnZ6czN3aTY1ZjRn",
  "https://www.instagram.com/reel/DIJjC1xoRZr/?igsh=eG9ycmJwZHdzM3Bu",
  "https://www.instagram.com/reel/DH4RInGNqvB/?igsh=MW9xbGg1ZHdld295OQ==",
  "https://www.instagram.com/reel/DInQk0MTUhH/?igsh=MTJsdGxvMnR4dTd6bA==",
  "https://www.instagram.com/reel/DDz3SsANZJV/?igsh=MW1pd25hdmk3aWlqYw==",
  "https://www.instagram.com/reel/DEIy6b-grit/?igsh=MTkxcnk2dW9yMWN4MA==",
  "https://www.instagram.com/reel/DG22y2YJ5dM/?igsh=aTJvN294N3UxbmR2",
  "https://www.instagram.com/reel/DE6bRD-IX7t/?igsh=MTNrcm9ud3JqaXF1Mg=="
];


  
  
  // Langsung shuffle pertama kali
  let shuffledAsupan = shuffle([...shadow])
  
  let handler = async (m, { conn,setReply }) => {
    setReply(mess.wait)
    if (shuffledAsupan.length === 0) shuffledAsupan = shuffle([...shadow])
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
  handler.command = ['shadow']
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
  