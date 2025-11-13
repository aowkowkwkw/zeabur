import downloadMedia from '../../lib/downloader.js'

const asupan = [
    "https://www.instagram.com/reel/DJBQmO6SsPk/?igsh=cmg2Y2t0ZnNmdWd5",
    "https://www.instagram.com/reel/DIvMblZyHWa/?igsh=eTVvcDc1cnZ2aHg=",
    "https://www.instagram.com/reel/DIYaqAgzdTU/?igsh=Ym9udzJpZXBodWY1",
    "https://www.instagram.com/reel/DHwrT64zVsf/?igsh=cWc4aHMwamNwYmxu",
    "https://www.instagram.com/reel/DHuEEZkzTDf/?igsh=MTluZThsbG5zdWN3aw==",
    "https://www.instagram.com/reel/DHZch_JT6Zm/?igsh=MTc3N3FldHBvbnA4cg==",
    "https://www.instagram.com/reel/DHTWr-pSqgR/?igsh=eHAzMnF0azlqc254",
    "https://www.instagram.com/reel/DHOU6pKyHJC/?igsh=MTBicTZpaWlzemZocg==",
    "https://www.instagram.com/reel/DHJES3uyjr6/?igsh=czF6enE4OWI1djJt",
    "https://www.instagram.com/reel/DGqLmUxzYio/?igsh=NWxqMXhpeXZwbWg4",
    "https://www.instagram.com/reel/DGNBH7zRCvN/?igsh=MWd1YjdtbThyaWM0",
    "https://www.instagram.com/reel/DF-U_MGy3cX/?igsh=MWxkNHlzZXlkdWJzbA==",
    "https://www.instagram.com/reel/DFwsjVXyax0/?igsh=djA4eTR5ZzkwamY0",
    "https://www.instagram.com/reel/DFerFN3SMhC/?igsh=MThndHpsZXMzbHM3Zw==",
    "https://www.instagram.com/reel/DFFrMmsSpCR/?igsh=czIyZ3pzbzJjdXdi",
    "https://www.instagram.com/reel/DEfCzcoySDB/?igsh=MXFvdWhsNDAzZWJscw==",
    "https://www.instagram.com/reel/DEEmojQTTB0/?igsh=MjBwcmp1aHYzdnN4",
    "https://www.instagram.com/reel/DD1F15XSSc-/?igsh=MWIwNmVnejF5dzU4ZQ==",
    "https://www.instagram.com/reel/DDHOPDtBf8N/?igsh=MWh3NGh0YWZxbzhldw==",
    "https://www.instagram.com/reel/DB808xGSZAg/?igsh=NG1oc3JmYm5yczZy",
    "https://www.instagram.com/reel/DBYw6MHSGFQ/?igsh=MTdzc2xjMmQwZzVncg==",
    "https://www.instagram.com/reel/DBTn1LqSh1m/?igsh=MTZ1MGQwbjV1bWVvNw==",
    "https://www.instagram.com/reel/DAIi9T_PwDH/?igsh=MXc1cWhwNnlkMGdyaA==",
    "https://www.instagram.com/reel/DAA45iihBlX/?igsh=MXY4eXRhamlvMHRrcA==",
    "https://www.instagram.com/reel/C_95_HLva2b/?igsh=MWw1dXkxdDZzMDZmdg==",
    "https://www.instagram.com/reel/C_QBzsPvU3c/?igsh=YXN2ZDQ5NTg1ZDB5",
    "https://www.instagram.com/reel/C_E6Mchv8El/?igsh=cm1pcGp5cnhlNjlj",
    "https://www.instagram.com/reel/C-7G7nMPa1S/?igsh=MTV2OWI3NzNibG0yaw==",
    "https://www.instagram.com/reel/C-rS9qpP6yP/?igsh=MTN6OWZxMTB4dHF0cQ==",
    "https://www.instagram.com/reel/C-hFaOBvqAa/?igsh=b2s5OXh6anh4bDBk",
    "https://www.instagram.com/reel/C9v2aKCS36N/?igsh=b2E2bWlta2Jlc2J2",
    "https://www.instagram.com/reel/C9kIRJnP2FK/?igsh=bnIyYTYxOGJ2cnht",
    "https://www.instagram.com/reel/C9Z2opXPhvZ/?igsh=M3Zkczg1ZWR1cXds",
    "https://www.instagram.com/reel/C9T_eeevS9m/?igsh=aTBzMjZpdW9jZmE=",
    "https://www.instagram.com/reel/C9KZ8S-PumW/?igsh=MTk3NTkwdnN4NzVjYQ==",
    "https://www.instagram.com/reel/C8YxxMVvat6/?igsh=MXZxbmk0a3U0OW44ZQ==",
    "https://www.instagram.com/reel/C8TR2V0PjVn/?igsh=aTRvaThpdDN2OGVs",
    "https://www.instagram.com/reel/C8PToWevfGx/?igsh=OWYyYzA4dG9sZnpj",
    "https://www.instagram.com/reel/C8OLQvsvYoJ/?igsh=MW1idDI4OTU1cDF1YQ==",
    "https://www.instagram.com/reel/C76I_aQvEOW/?igsh=MWIwbTF3Nnp4cGZjNA==",
    "https://www.instagram.com/reel/C70swtQvxum/?igsh=YnRibXFjZDM0YWRv",
    "https://www.instagram.com/reel/C7ePwXuPaha/?igsh=MWJ2NDVudDVwOWozZQ==",
    "https://www.instagram.com/reel/C7ZGdYsvRd4/?igsh=Y3E5aG14aGwyd2h1",
    "https://www.instagram.com/reel/C68EDCFrnnM/?igsh=MWp2bmo4bGp6b2cxNQ==",
    "https://www.instagram.com/reel/C63vXhqrClA/?igsh=d3R0MWZudDc0ZHN3",
    "https://www.instagram.com/reel/C6h9w79rW1D/?igsh=NTgyM3RycXMxZ2Np",
    "https://www.instagram.com/reel/C6ghG7MLq4Z/?igsh=MXIzZ3ZzdzF2YWhpZQ==",
    "https://www.instagram.com/reel/C6WL6e3r3Kz/?igsh=MWFmNGdhYnQ4b3VxNQ==",
    "https://www.instagram.com/reel/C6Nt6CLLnbR/?igsh=MzUxdTRxaHZ0MXk0",
    "https://www.instagram.com/reel/C6GS2rTrLDP/?igsh=MWM4dGJ2ZmlpM2R4bA==",
    "https://www.instagram.com/reel/C6BLfb2R0eH/?igsh=aDZzbWpmOWZ4Njk2"
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
  handler.command = ['maar']
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
  