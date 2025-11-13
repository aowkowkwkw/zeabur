import downloadMedia from '../../lib/downloader.js'

const asupan = [
  "https://www.instagram.com/reel/DDuVUjFNQwF/?igsh=eTdqY3l0YmdoYWtt",
  "https://www.instagram.com/reel/DG8waBJJNeU/?igsh=djY0ZjAzZTVlbHVi",
  "https://www.instagram.com/reel/DFN2p4XoUag/?igsh=MW4zcm0ybDZ1ZTJ0MA==",
  "https://www.instagram.com/reel/DDhW_jJu3LR/?igsh=MW1neTBsMHl4eTkwag==",
  "https://www.instagram.com/reel/DFO_GDUIEpu/?igsh=MWhza3piNzNubG9xNA==",
  "https://www.instagram.com/reel/DIrE-HTNX2f/?igsh=dWx6cHRva2hmZHAz",
  "https://www.instagram.com/reel/DHy6yziNLdN/?igsh=andoMzAxdjc0cGVu",
  "https://www.instagram.com/reel/DGxlW56SALX/?igsh=bGh2aTV0enN6aXQ2",
  "https://www.instagram.com/reel/DGhT6TpRXvC/?igsh=bXdnMzYxOWxqNjBp",
  "https://www.instagram.com/reel/DC6Ei21Of3l/?igsh=MXFqeHE5eHczcmxrdg==",
  "https://www.instagram.com/reel/DDDTSiVuXCL/?igsh=N2t6ZHpnOGNib3d5",
  "https://www.instagram.com/reel/DChKFO8oxGX/?igsh=MW9pN3RjNnduMmg5OA==",
  "https://www.instagram.com/reel/DD6qRIGyjoE/?igsh=MXh5cjRyb3NnbWV1aA==",
  "https://www.instagram.com/reel/DJTqINOzxDB/?igsh=YmowYm9iOWZzb3Ax",
  "https://www.instagram.com/reel/DI9OP2wS6vI/?igsh=MXBqaWl4a281OGw2aQ==",
  "https://www.instagram.com/reel/DFxwAYhJCUP/?igsh=b3NteTFkMHd4YTg2",
  "https://www.instagram.com/reel/DFZFO0Hz2zy/?igsh=bW9pNmZ0ZmlvdjBp",
  "https://www.instagram.com/reel/DHbIOJEPkmc/?igsh=MWZtaDFsdHU3dnoxbw==",
  "https://www.instagram.com/reel/DCUnNIvo1cn/?igsh=NTdpMjVlZHNuemFk",
  "https://www.instagram.com/reel/DCyIx1_R03O/?igsh=dHN5NGdieWJtbzZw",
  "https://www.instagram.com/reel/DEAwqrIJlKv/?igsh=cXRnM2FxcGpvaWdo",
  "https://www.instagram.com/reel/DHTcfYnKJpI/?igsh=MTRqeHR4MHhyejJraw==",
  "https://www.instagram.com/reel/DET1EwCPt3B/?igsh=MWV5aGcyZTZ2YzRmbg==",
  "https://www.instagram.com/reel/DEsUQmxor4v/?igsh=ZXd5eXdwdWdvdnRk",
  "https://www.instagram.com/reel/DCP0g0qI9GL/?igsh=MWd3MnpoaWs3MGd4eA==",
  "https://www.instagram.com/reel/DFeyt2NzavP/?igsh=MW9sZXNtaXBqdm83dA==",
  "https://www.instagram.com/reel/DHZCzi2oRGz/?igsh=MWlzYzltOGU0YzBudQ==",
  "https://www.instagram.com/reel/DIO32FlSBOj/?igsh=MTF4NWhyZnAxZWlpYg==",
  "https://www.instagram.com/reel/DHbY_DMtXq2/?igsh=MWplYmV3eGFkMWN6bA==",
  "https://www.instagram.com/reel/DExXuYqoQ3j/?igsh=MWU4M3IzMGp5bjA4OQ==",
  "https://www.instagram.com/reel/DB6HlrDqMqv/?igsh=YWpreTgzN3Frc3Vh",
  "https://www.instagram.com/reel/DH3h9gTCSz_/?igsh=MXN1YTM5N3UweXRrdw==",
  "https://www.instagram.com/reel/DEkI6xPIimS/?igsh=NHV4NTVkd2preXE3",
  "https://www.instagram.com/reel/DEC5FryShjA/?igsh=MXB0bnRmZ3dnZXdsZQ==",
  "https://www.instagram.com/reel/DGsoH7RNgZ_/?igsh=MTFsd2c3eHF5ZnNzbw==",
  "https://www.instagram.com/reel/DICPUMDyi2v/?igsh=MWRwNmhnN3Q4NzJpcQ==",
  "https://www.instagram.com/reel/DHpkQWFvZC-/?igsh=aXV2YWg0cWwxdndh",
  "https://www.instagram.com/reel/DCJqiz6vjLL/?igsh=NGtoM2ZtNGE1dW1h",
  "https://www.instagram.com/reel/DIOVIdnIqHB/?igsh=amdxNnVqcWk1NzJn",
  "https://www.instagram.com/reel/DHgbda2tJXo/?igsh=YmIyNGQ0bXQ1Z3B2",
  "https://www.instagram.com/reel/DFqV0X9I0Px/?igsh=Zm1oajl3cDhzMnls",
  "https://www.instagram.com/reel/DIE3b_hoKyG/?igsh=MTN5eHY4ZzQzZTE2ZA==",
  "https://www.instagram.com/reel/DHbY1QiTn4i/?igsh=NG1kejZleTB4dHhj",
  "https://www.instagram.com/reel/DHqmMWGIFr8/?igsh=encybG1kOWRsM2F3",
  "https://www.instagram.com/reel/DHFgl7Ft9QG/?igsh=MXZreGRoOWhmc2V6Yw==",
  "https://www.instagram.com/reel/DEqvOKDTCVX/?igsh=enU0MDhyYWxxNWw2",
  "https://www.instagram.com/reel/DDTGzdBIQyN/?igsh=bXlxYjRudmFhcHB0",
  "https://www.instagram.com/reel/DEXsYCBtmPU/?igsh=MXVoaWc5aDJ2NWxtcw==",
  "https://www.instagram.com/reel/DGsP7OjoD1j/?igsh=Njd6NnY5Y3lpc2Nu",
  "https://www.instagram.com/reel/DDwc6DHo9rn/?igsh=MWZ6aDUzYmV4c2RtOQ==",
  "https://www.instagram.com/reel/DBTkzv8Smet/?igsh=a2dvMGV2YWJjZ21s",
  "https://www.instagram.com/reel/DFj1_gkohZq/?igsh=cndkaHpydDJuOXpx",
    "https://www.instagram.com/reel/DC4sI2OIeMr/?igsh=N3phcTRvc2w0ejZw",
  "https://www.instagram.com/reel/DEXxxvatM2P/?igsh=MWl6cTd6aHZxbXVyaQ==",
  "https://www.instagram.com/reel/DJj20TwIfCJ/?igsh=NjZhYzY4Zmk1NjZu",
  "https://www.instagram.com/reel/DH1HMpRoUX7/?igsh=MW1sYXN1dzdpaDl3ZQ==",
  "https://www.instagram.com/reel/DHygVqEoNGG/?igsh=MWliaWE0cWhqNGFoYQ==",
  "https://www.instagram.com/reel/DHp-fLxIpBo/?igsh=MWNxdXdkNDhpbWd4aQ==",
  "https://www.instagram.com/reel/DHcrwM7oU5h/?igsh=eDczOXpwN3RjZzQ1",
  "https://www.instagram.com/reel/DG3io7UIVtQ/?igsh=MTJmZXdpbGppZnBpeQ==",
  "https://www.instagram.com/reel/DGa0_qvIoDJ/?igsh=Zm90M3FkcHVtMnRo",
    "https://www.instagram.com/reel/DGN_5psTQCa/?igsh=MWpiNXNjcW05eGlzNA==",
  "https://www.instagram.com/reel/DGT8ACTItiH/?igsh=MWd0ZWczc3ZkdzNqZQ==",
  "https://www.instagram.com/reel/DJhI_mhhFLc/?igsh=amJwc3VmZ3BteHdi",
  "https://www.instagram.com/reel/DGC4mxsxhne/?igsh=MmRmYjB5Mjl3MDlv"
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
  handler.command = ['amv']
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
  