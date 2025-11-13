import downloadMedia from '../../lib/downloader.js'

const naruto = [
  "https://www.instagram.com/reel/DHKh3dbt3Gp/?igsh=MXg4ODZmY2xjZmF3bQ==",
  "https://www.instagram.com/reel/DIDf0GgTNqx/?igsh=c3JnZzRsZjAzNWI=",
  "https://www.instagram.com/reel/DILO5s5JKip/?igsh=MW1ncmR2ano4ZXdyOA==",
  "https://www.instagram.com/reel/DHQWR5Dzk0b/?igsh=ZDl4a3B6cXg3cGoz",
  "https://www.instagram.com/reel/DCv5FOkz5iV/?igsh=MWc1OXN4bDFpemoybA==",
  "https://www.instagram.com/reel/DDPmkAJTIqC/?igsh=c2M1d3d6a2lqZHE4",
  "https://www.instagram.com/reel/DC_K69lyotp/?igsh=MTc0OTRhZW9maWxwbg==",
  "https://www.instagram.com/reel/DDKmvndzCEb/?igsh=MWw0YmxsOHF3NWp1bw==",
  "https://www.instagram.com/reel/DF5mXhjoxKZ/?igsh=aDJwOHZqaTRpcjJl",
  "https://www.instagram.com/reel/DIrE-HTNX2f/?igsh=dWx6cHRva2hmZHAz",
  "https://www.instagram.com/reel/DHy6yziNLdN/?igsh=andoMzAxdjc0cGVu",
  "https://www.instagram.com/reel/DI_sITxNK4t/?igsh=MWZmajFpeWpvanF1dw==",
  "https://www.instagram.com/reel/DHTcfYnKJpI/?igsh=MTRqeHR4MHhyejJraw==",
  "https://www.instagram.com/reel/DEkI6xPIimS/?igsh=NHV4NTVkd2preXE3",
  "https://www.instagram.com/reel/DCJqiz6vjLL/?igsh=NGtoM2ZtNGE1dW1h",
  "https://www.instagram.com/reel/DFqV0X9I0Px/?igsh=Zm1oajl3cDhzMnls",
  "https://www.instagram.com/reel/DIE3b_hoKyG/?igsh=MTN5eHY4ZzQzZTE2ZA==",
  "https://www.instagram.com/reel/DHqmMWGIFr8/?igsh=encybG1kOWRsM2F3",
  "https://www.instagram.com/reel/DGxgKAHp9EN/?igsh=eDRmY3Y2ZXVtd2Rn",
  "https://www.instagram.com/reel/DFj1_gkohZq/?igsh=cndkaHpydDJuOXpx",
    "https://www.instagram.com/reel/DE20rtJzqdX/?igsh=aXdiMnh5eDRkcmdh",
  "https://www.instagram.com/reel/DDehX6PMpWx/?igsh=MWh2bXhrcDlrOTlzaQ=="
];;
  
  
  // Langsung shuffle pertama kali
  let shuffledAsupan = shuffle([...naruto])
  
  let handler = async (m, { conn,setReply }) => {
    setReply(mess.wait)
    if (shuffledAsupan.length === 0) shuffledAsupan = shuffle([...naruto])
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
  handler.command = ['naruto']
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
  