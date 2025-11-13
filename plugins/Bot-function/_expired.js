 

 

let handler = m => m;

// Cegah multiple loop
let isCheckingExpiration = false;
let notifikasiIntervalStarted = false;

handler.before = async function () {
  const data = db.data.chats;

  // =====================
  // CEK EXPIRED SEWA
  // =====================
  if (!isCheckingExpiration) {
    isCheckingExpiration = true;

    const checkExpiration = async () => {
      const currentTime = Date.now();

      for (const key in data) {
        if (!Object.hasOwnProperty.call(data, key)) continue;
        const item = data[key];

        if (item.expired !== 0 && item.expired < currentTime) {
          console.log(`Sewa '${key}' telah berakhir!`);
          delete global.db.data.chats[key];
       //   delete conn.chats[key]

          const photo = fotoRandom.getRandom();
          const contextInfo = {
            forwardingScore: 50,
            isForwarded: true,
            externalAdReply: {
              title: botName,
              body: baileysVersion,
              previewType: 'PHOTO',
              thumbnailUrl: photo,
            },
          };

          const Ownerin = `${nomerOwner}@s.whatsapp.net`;
          const text = `
––––––『 *SEWA EXPIRED* 』––––––
🔰 *Group*
• Name: ${item.name}
• Creator: ${item.creator}
• Group Id: ${item.id}
• Time order: ${item.timeOrder}
• Time end: ${item.timeEnd}
•·–––––––––––––––––––––––––·•`;

          conn.sendMessage(Ownerin, { contextInfo, text });
          await sleep(2000);

          const cekdata = conn.chats[key]?.metadata || (await conn.groupMetadata(key).catch(() => false));
          if (!cekdata) continue;
          const member = cekdata.participants
          const mentionAdmins = member.filter(item => item.admin === 'admin' || item.admin === 'superadmin').map(item => item.id);
          const pickAdmin = mentionAdmins.getRandom()

          
let notif = 
`Hai kak admin group *${item.name}* 👋

Waktu sewa bot di grup ini sudah habis ya, 
jadi bot akan keluar dari grup secara otomatis,

Terima kasih banyak sudah mempercayakan 
layanan kami selama ini. 
Semoga bot kami bisa membantu dan membuat 
grup kalian makin seru dan makin asik!

Kalau ingin perpanjang atau ada pertanyaan, 
jangan ragu hubungi kami, ya!
${botName.toLowerCase() } pamit dulu 🥺

Salam hangat,  

${copyright} ${calender}`;


let notifAdmin1 =`
Hai kak...

kak order ${botName.toLowerCase()} lagi dong ka
${botName.toLowerCase()} masih betah nih di group ${item.name}
sama kalian semua

tapi waktu sewa malah udah abis
jadi ${botName.toLowerCase()} di suruh pulang sama owner

padahal baru mau seru-seruan lagi lho
yuk order lagi ka, biar ${botName.toLowerCase()} 
bisa balik main bareng sama kalian semua

walau kadang ${botName.toLowerCase()}  cuman nyimak doang :v
`

let notifAdmin2 =`
Btw dari semua admin group ${item.name}
cuman kaka yang aku chat kek gini,
soalnya kaka orangnya asik 
dan suka ngegosib di group hehe 😆
`



          await conn.sendMessage(key, { text:notif,mentions:mentionAdmins })
          await sleep(2000)
          await conn.groupLeave(key)
          await sleep(2000)
          await conn.sendMessage(pickAdmin, { text:notifAdmin1})
          await sleep(2000)
          if(mentionAdmins.length > 1) conn.sendMessage(pickAdmin, { text:notifAdmin2})
             
        }
      }

      setTimeout(checkExpiration, 2000); // loop ulang tiap 2 detik
    };

    checkExpiration();
  }

  // =====================
  // NOTIFIKASI WAKTU SEWA TERSISA
  // =====================
  if (!notifikasiIntervalStarted) {
    notifikasiIntervalStarted = true;

    global._notifikasiInterval = setInterval(async () => {
      try {
        for (const chat of Object.values(data)) {
          if (!chat.expired || chat.expired <= 0) continue;

          if (chat.threeDaysLeft === undefined) chat.threeDaysLeft = false;
          if (chat.tenDaysLeft === undefined) chat.tenDaysLeft = false;
          if (chat.oneDaysLeft === undefined) chat.oneDaysLeft = false;

          const now = Date.now();
          const threeLeft = conn.ms(chat.expired - now - conn.toMs("3d"));
          const tenLeft = conn.ms(chat.expired - now - conn.toMs("10d"));
          const oneLeft = conn.ms(chat.expired - now - conn.toMs("1d"));

          const photo = fotoRandom.getRandom();
          const contextInfo = {
            forwardingScore: 50,
            isForwarded: true,
            externalAdReply: {
              title: botName,
              body: baileysVersion,
              previewType: "PHOTO",
              thumbnailUrl: photo,
            },
          };

          const kirimNotifikasi = async (flagName, left, label) => {
            if (chat[flagName] || left.days > 0) return;
            chat[flagName] = true;

            const cekid = conn.ms(chat.expired - now);
            const teks = `
––––––『 *SISA WAKTU* 』––––––

*Group*: ${chat.name}
*ID*: ${chat.id}
*EXPIRE :* ${cekid.days} Hari, ${cekid.hours} Jam, ${cekid.minutes} Menit, ${cekid.seconds} Detik

📮 *Note:* ↓
• Silakan hub owner untuk menambah sewa
`;
            await conn.sendMessage(chat.id, { contextInfo, text: teks }).catch(console.log);
          };

          await kirimNotifikasi('tenDaysLeft', tenLeft, '10 Hari');
          await kirimNotifikasi('threeDaysLeft', threeLeft, '3 Hari');
          await kirimNotifikasi('oneDaysLeft', oneLeft, '1 Hari');
        }
      } catch (err) {
        console.error(err);
      }
    }, 30_000); // setiap 30 detik
  }
};

export default handler;
