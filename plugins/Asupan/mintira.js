import downloadMedia from '../../lib/downloader.js'

const asupan = [
    "https://www.instagram.com/reel/DJEziE1hRwP/?igsh=MWgwbmcyMGFwY29pbA==",
    "https://www.instagram.com/reel/DJCSzPEBmS5/?igsh=dndwaWRpdzQxbHBy",
    "https://www.instagram.com/reel/DI84-ggBb0o/?igsh=M3F2Z2w3bzBvM2Qz",
    "https://www.instagram.com/reel/DI7axUGhSg7/?igsh=MWU5YjdzMmtwYXN2NA==",
    "https://www.instagram.com/reel/DI3zFHVBvzo/?igsh=MWoyZXcwdmRxZ2E2eQ==",
    "https://www.instagram.com/reel/DIqXa1zhQwy/?igsh=Y3ZreHhtcTI2YWZt",
    "https://www.instagram.com/reel/DIgznXfBfF4/?igsh=MWMxOXQ2bGlkbGF0aA==",
    "https://www.instagram.com/reel/DIgkGlOBatZ/?igsh=MWdibHIxdnppMmNkdg==",
    "https://www.instagram.com/reel/DId6tezB023/?igsh=b20xZ243cDM0M2gx",
    "https://www.instagram.com/reel/DIQ-LjqBKSe/?igsh=MWx2NHg1bG1tM3B0NQ==",
    "https://www.instagram.com/reel/DIOm91RBWPv/?igsh=MWk2MXpzZW55NjE0Nw==",
    "https://www.instagram.com/reel/DIG0hCHBmSK/?igsh=MTQwYWxzeTRvYTVsbw==",
    "https://www.instagram.com/reel/DH50iPJhZeZ/?igsh=MTY2Y3Zrem44djF2Yg==",
    "https://www.instagram.com/reel/DHvZO4Ehz8-/?igsh=MWh2NHJraHd5ZThxcg==",
    "https://www.instagram.com/reel/DHqttb8hN7u/?igsh=ZXo4cGJxeWxxczll",
    "https://www.instagram.com/reel/DHdxdryhbhS/?igsh=MWphZm1pMnpocThhcA==",
    "https://www.instagram.com/reel/DHbOz_-Bm_I/?igsh=MTluajEzMXVxcmtlZg==",
    "https://www.instagram.com/reel/DHY7LI9hV17/?igsh=MWo5b3lnMW4zaWwwag==",
    "https://www.instagram.com/reel/DHQ9pJ_hY0X/?igsh=MXFrbjkzbzV1dzIzeg==",
    "https://www.instagram.com/reel/DHBHOmRhDtA/?igsh=eGg4dWhtNWl1amJk",
    "https://www.instagram.com/reel/DG7OPOAh0es/?igsh=N3k1a2lkcGsxNno2",
    "https://www.instagram.com/reel/DG4yVm8BM95/?igsh=ajVxeWEybjV4cWxm",
    "https://www.instagram.com/reel/DG0w1OZBQrk/?igsh=dmtvOHA4djV6ODNt",
    "https://www.instagram.com/reel/DGueSFHh0SF/?igsh=MTBwcW83YzJ0OTliZw==",
    "https://www.instagram.com/reel/DGiXO8kh14L/?igsh=MWttZTF5dnJjZmo3MA==",
    "https://www.instagram.com/reel/DGX6ki9hGYa/?igsh=YTBrMm9rNHY5N2xn",
    "https://www.instagram.com/reel/DGQJJCQB3bL/?igsh=OXh6cWR4a2QxMXc=",
    "https://www.instagram.com/reel/DGAwDKBJKgp/?igsh=eGhyNmphOTZlaHhu",
    "https://www.instagram.com/reel/DF5Bd-kpKnN/?igsh=NXhuMDkxbncwYW1u",
    "https://www.instagram.com/reel/DFxsZnWSsiy/?igsh=MW5pYzcxenJ1amx1aQ==",
    "https://www.instagram.com/reel/DFptNszpIF4/?igsh=MW5mOTljdGl5NHczag==",
    "https://www.instagram.com/reel/DFkOK8ipSYu/?igsh=c2NiZHIycnBlZGNi",
    "https://www.instagram.com/reel/DE7IduCpqwB/?igsh=YWd3YjFmaXk1emRh",
    "https://www.instagram.com/reel/DExWdPpSvie/?igsh=MTlwaHdseW9vc3p2cg=="
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
       // conn.sendFile(m.chat, media.url,'', '', m)
       conn.sendMessage(m.chat, { video: { url:media.url }  }, { quoted: m });
       } else conn.sendMessage(m.chat, { image: { url:media.url }  }, { quoted: m });

        /* media.url is or are link of videos or images that just one by one
         * or do something with your project
         */
     }

  }
  
  handler.help = ['asupan']
  handler.tags = ['random']
  handler.command = ['mintira']
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
  