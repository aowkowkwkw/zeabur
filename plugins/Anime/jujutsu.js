import downloadMedia from '../../lib/downloader.js'

const jujutsu = [
  "https://www.instagram.com/reel/DE-O1BhPj-u/?igsh=eWw1dzdqNWl4MGow",
  "https://www.instagram.com/reel/DCmQt_rgefs/?igsh=cmQ3Y3NtdnR0ZzBm",
  "https://www.instagram.com/reel/DHRkshuNWaC/?igsh=dTRnM2pkbmJscDRm",
  "https://www.instagram.com/reel/DCbyRP-pMR6/?igsh=azFkOWR1czN2M3Bx",
  "https://www.instagram.com/reel/DJgSvd5Ito0/?igsh=MWUwNWxzNWg2dmxqNg==",
  "https://www.instagram.com/reel/DFQtJDVz5oa/?igsh=b3RvNng4OXo1bGF5",
  "https://www.instagram.com/reel/DIIs4dZt3zP/?igsh=b3FoeTRraGd3NWFh",
  "https://www.instagram.com/reel/DH_CuxLNCfq/?igsh=Mjd2dTZhbnlmdTBp",
  "https://www.instagram.com/reel/DHlct8JtXIa/?igsh=OXN3d285c2syODVp",
  "https://www.instagram.com/reel/CzF40nXrCl_/?igsh=ZnR2ZDB5a2N6MjVm",
  "https://www.instagram.com/reel/Cxq5m7PBYUt/?igsh=MWFwd2ZhZ2NjcnprbQ==",
  "https://www.instagram.com/reel/CxlECi_RQxE/?igsh=cGxtcnA1OXI3M2k3",
  "https://www.instagram.com/reel/DEiPhuSSimq/?igsh=Mm1lang2dGhwdG9v",
  "https://www.instagram.com/reel/DHJ6L3ny1BX/?igsh=MTJ4aGpoY3phd3phdQ==",
  "https://www.instagram.com/reel/DICPUMDyi2v/?igsh=MWRwNmhnN3Q4NzJpcQ==",
  "https://www.instagram.com/reel/DF3G3_moc4X/?igsh=ZmtidHU5aDgyM3d4",
  "https://www.instagram.com/reel/DJZO8T2o2vZ/?igsh=bzRudXlqcm52NHh0",
  "https://www.instagram.com/reel/DJTJcimIeav/?igsh=MTUzcDd0ZHZqanF1ZQ==",
    "https://www.instagram.com/reel/DGPNNdATN5c/?igsh=MXc1bm1pdWVzajN1cQ==",
  "https://www.instagram.com/reel/DDMwNo2o4tZ/?igsh=cWdlbmUzZGV5dGJq",
  "https://www.instagram.com/reel/DFFpETdBv0d/?igsh=MWMyMGs1c3hjeW90Ng==",
  "https://www.instagram.com/reel/DDRtjzrIrmD/?igsh=a3lnYjZkOGp2NTR6",
  "https://www.instagram.com/reel/DDh90PMTd4V/?igsh=cHg3cHZvOW9uajg3",
  "https://www.instagram.com/reel/DEArXPHTB56/?igsh=dmp1Zm54bzZkcWY0",
  "https://www.instagram.com/reel/DCmPgjutOrJ/?igsh=Z2lncnBhcTUxc2pn",
  "https://www.instagram.com/reel/DIRUoHotFW2/?igsh=MzR5YjVycGl2dm0w",
  "https://www.instagram.com/reel/DFAgUBOMQ_D/?igsh=cDFkemFobDBxMW8=",
  "https://www.instagram.com/reel/DCy5AubzCzy/?igsh=bjFoc2l5d2tqNjY3",
  "https://www.instagram.com/reel/DJeYikvPC73/?igsh=bTVwbzFuM2UyZWEw",
  "https://www.instagram.com/reel/DJWpN_Oz9F7/?igsh=MThwcXVzeThpMjE2NA==",
  "https://www.instagram.com/reel/DJQ4Q0lTy-j/?igsh=MXZmenRnYnFyYXpxOQ==",
  "https://www.instagram.com/reel/DJNVL3_TDG2/?igsh=YXE4cDJmN3RsMTRr",
  "https://www.instagram.com/reel/DJJEDsHI4zE/?igsh=MTdmdWc2em0yMzc4Yw==",
  "https://www.instagram.com/reel/DI89fo6Tjfj/?igsh=aHQ2enhra2V5YXk1",
  "https://www.instagram.com/reel/DIw15olzJGb/?igsh=dTBlOW1yaTdxdXNk",
  "https://www.instagram.com/reel/DIzoSsuI9RF/?igsh=cG80MnF0MnpkdmR2",
  "https://www.instagram.com/reel/DIrJlkpTPyY/?igsh=MTN6ZDg5NWpkNXdtZA==",
  "https://www.instagram.com/reel/DIbbvXrThWd/?igsh=dHR3bTN3ZXd6N2J1",
  "https://www.instagram.com/reel/DH_5TPsotET/?igsh=MWN5cHFuYjE0NDF3cg==",
  "https://www.instagram.com/reel/DHx-44RPmYg/?igsh=dnl2M2pxeHp0b241",
  "https://www.instagram.com/reel/DHtBcSWzVFu/?igsh=MTI3cjJpeXpzdnJ4aw==",
  "https://www.instagram.com/reel/DEC3uzOM3AT/?igsh=MXg0N3ZzZTB3c3JiYQ==",
  "https://www.instagram.com/reel/DFVl611yBP0/?igsh=eHN0dXR3YXc4YXJu",
  "https://www.instagram.com/reel/DInimX6zRJR/?igsh=MXhnZzNucDBydjJzdg==",
  "https://www.instagram.com/reel/DC24gNZvXrz/?igsh=MTFxemV1YXk4eHdjNQ==",
  "https://www.instagram.com/reel/DEr6FCjTkUt/?igsh=YzVhNGI4Nnhzcjgy",
    "https://www.instagram.com/reel/DGUuKEHRN_v/?igsh=YTZ0ZWI4aGluMGF1",
  "https://www.instagram.com/reel/DJCbJunobTZ/?igsh=YzVjd2g0bHpxODZs",
  "https://www.instagram.com/reel/DGMUP_miIRu/?igsh=MXVkd2xtZ210YTZhZw==",
  "https://www.instagram.com/reel/DJo9pjas4Us/?igsh=MTZ1Y3R6Zmo4OXNxaQ==",
    "https://www.instagram.com/reel/DJqq0OORHiy/?igsh=MW84ZHB4bG1sOWZs",
  "https://www.instagram.com/reel/DHLKw1tScVS/?igsh=cjZhMWdwMDU0Z2Fk",
  "https://www.instagram.com/reel/DIjZCrXowP_/?igsh=enk1eHN2MzdhaHNu",
  "https://www.instagram.com/reel/DIBgkngMtZG/?igsh=b3FlZjllenFiY3Rx",
  "https://www.instagram.com/reel/DJ7PzyQzaMi/?igsh=MXNsb2YxbHNqeTE2ZQ==",
  "https://www.instagram.com/reel/DI6ID-zM1Vc/?igsh=Y3QxMGhyNzhtaDYw"
];

  
  
  // Langsung shuffle pertama kali
  let shuffledAsupan = shuffle([...jujutsu])
  
  let handler = async (m, { conn,setReply }) => {
    setReply(mess.wait)
    if (shuffledAsupan.length === 0) shuffledAsupan = shuffle([...jujutsu])
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
  handler.command = ['jujutsu']
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
  