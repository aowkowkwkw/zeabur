import downloadMedia from '../../lib/downloader.js'

const asupan = [
    "https://www.instagram.com/reel/DGDLNrfT4m_/?igsh=MTkzYzY3bTR6dXBnYQ==",
    "https://www.instagram.com/reel/DIgXDxFTDhe/?igsh=MW96enAwbTE0NzJsaA==",
    "https://www.instagram.com/reel/DJBwHPuzI0r/?igsh=eWw5aTZpZ3FydG16",
    "https://www.instagram.com/reel/DByanoIzC3m/?igsh=ZTdva3AyaXV5bjZ4",
    "https://www.instagram.com/reel/DIOTtgRS2Ek/?igsh=MTh2OGswdDczcTFzdA==",
    "https://www.instagram.com/reel/DHYU9tYTet-/?igsh=MWJqN2Nsd2pyYjNyaQ==",
    "https://www.instagram.com/reel/DHYTKN9yhab/?igsh=eTZkYm41bGttbzln",
    "https://www.instagram.com/reel/DDzY7lPPmGV/?igsh=M2ozOXVsdml4MTdo",
    "https://www.instagram.com/reel/DHYkbT5SNLG/?igsh=ODBhOWM2MndtZjR5",
    "https://www.instagram.com/reel/DHneuf5ADn4/?igsh=eXV1NmJocnZjeXhl",
    "https://www.instagram.com/reel/DGcp7jtyZoZ/?igsh=MWd5anFyaGZxMmNsZw==",
    "https://www.instagram.com/reel/DIOBuBnzFd3/?igsh=MXM4ODJubXExb3Q4YQ==",
    "https://www.instagram.com/reel/DC1cSc3Btnd/?igsh=MXB0ZXhrcWFhenozcA==",
    "https://www.instagram.com/reel/DF6mla4vTfs/?igsh=NHZrM2Fta2loeGdi",
    "https://www.instagram.com/reel/DHqybSmTDt_/?igsh=MW1mMmNjMms4MGdkOA==",
    "https://www.instagram.com/reel/DGDGxmogbvf/?igsh=MWkydjh2MHh2Z2V3Zg==",
    "https://www.instagram.com/reel/DEv-lXCubRM/?igsh=aG1lbnNrMWVnd3Fi",
    "https://www.instagram.com/reel/DHRToKVSZNy/?igsh=MXYyNnllY3EzYWcyag==",
    "https://www.instagram.com/reel/DGCjl4UJWZg/?igsh=MTNvd2hncno0dnphdA==",
    "https://www.instagram.com/reel/DG-NrSBTO63/?igsh=ZnUxdXNocmc4ZnBm",
    "https://www.instagram.com/reel/DGY7F0rsDKy/?igsh=MWNhcTdkZGRhZG5ncA==",
    "https://www.instagram.com/reel/DF2XU_ITJRD/?igsh=MWN1czFoM2Q3bXdiZA==",
    "https://www.instagram.com/reel/DFWi9YCS8Ia/?igsh=M2lnNjU4dGhjbGY4",
    "https://www.instagram.com/reel/DChE6tWO5Fr/?igsh=MjZsaHZ3MjFpbTZ1",
    "https://www.instagram.com/reel/C_aM5Gryh0F/?igsh=dmVrb2RqZHV6YWk5",
    "https://www.instagram.com/reel/DE7XX78N3Ri/?igsh=NWVhaTh3bXBlODg1",
    "https://www.instagram.com/reel/DApfwZ8CK2y/?igsh=MXB2MHNrYnRoejgxbQ==",
    "https://www.instagram.com/reel/DDd-VhtPnTD/?igsh=MTJnNHJ0OWQ0ZzJ6OQ==",
    "https://www.instagram.com/reel/C-lZgM7xdAR/?igsh=MWV3eGFzNjl3cXN0OA==",
    "https://www.instagram.com/reel/DBicOxFRBpG/?igsh=MXZ3M2Vmd2ppenF4aw==",
    "https://www.instagram.com/reel/DB-1v70P2Dh/?igsh=MTVtODJ5M3prNGd5aQ==",
    "https://www.instagram.com/reel/DBnvXckJ-a6/?igsh=MTdpZml6a2VzNWZmbg==",
    "https://www.instagram.com/reel/DEZyEHmqVCW/?igsh=MTQ2ZW4yOXI2aWJuOA==",
    "https://www.instagram.com/reel/DEhZabQzFjL/?igsh=NWk5bHp6eW1va2c1",
    "https://www.instagram.com/reel/DCOpwdGSA1b/?igsh=bXZ1OXA4eWdwMTBn",
    "https://www.instagram.com/reel/DCl10P4sqNK/?igsh=bHJ4ZG8zcTZneHls",
    "https://www.instagram.com/reel/DAQwJQ7vQ2A/?igsh=MWdiZzhydDhoZHp2ZQ==",
    "https://www.instagram.com/reel/C87lmTayTBA/?igsh=MTVwZmt4Mmljc3J2aw==",
    "https://www.instagram.com/reel/C-mGzdvykd5/?igsh=MTlhOHRycmNjMGR1ZQ==",
    "https://www.instagram.com/reel/C_1IedUx1ix/?igsh=MXY4ZWY3cmVuM25qdA==",
    "https://www.instagram.com/reel/C9n_EOiBGcn/?igsh=YjJldzViOHFjbnEz",
    "https://www.instagram.com/reel/C9ql4HxyVZF/?igsh=MWI3OGtjMmo0NGJhcA==",
    "https://www.instagram.com/reel/C9e6pMaxBAL/?igsh=ZndhZHUzaGhuZDds",
    "https://www.instagram.com/reel/C8ydW4Ipsyn/?igsh=OGkzOWZjdXpxbXhn",
    "https://www.instagram.com/reel/C8dwqwhvd4G/?igsh=MXA4dG90c3c5bHlpYg==",
    "https://www.instagram.com/reel/C8Qc0qfyiCp/?igsh=ZzV1MGpubTJucXZ6",
    "https://www.instagram.com/reel/C5f21u1vdEL/?igsh=MXF5eXk2OXhoYnliOQ==",
    "https://www.instagram.com/reel/C8Kx_kPK46v/?igsh=YTM0bW1tZXkydTFi",
    "https://www.instagram.com/reel/C6t5nGjxfNW/?igsh=d3FzNHM5cTdkNHRn",
    "https://www.instagram.com/reel/DIsjel5JxQA/?igsh=dmljbmQycDBhMm03",
    "https://www.instagram.com/reel/DGKrXo5SxWx/?igsh=MTlseGhuZ25vZDkybQ==",
    "https://www.instagram.com/reel/DGeWAd8t41D/?igsh=a21ucTVocHJibXRh",
    "https://www.instagram.com/reel/DG5G-hWB3zI/?igsh=MXRlYTVkZThrZXJuZA==",
    "https://www.instagram.com/reel/DFz8UxOxUyG/?igsh=MWFodGN2N2l3aGF1bQ==",
    "https://www.instagram.com/reel/DHNrbpsykSz/?igsh=MXY1c2xpMDdnNjJmYg=="
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
  handler.command = ['lucu']
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
  