 
let handler = async (m, { conn, args, isPremium, isOwner, setReply }) => {
 
  let prefix = ".";
  let name = m.mentionByReply
    ? await conn.getName(m.mentionByReply)
    : m.pushname;
  let number = m.mentionByReply
    ? m.mentionByReply.split("@")[0]
    : m.senderNumber;
  let limid = m.mentionByReply
    ? db.data.users[m.mentionByReply].premiumTime !== 0
      ? "Unlimited"
      : `${db.data.users[m.mentionByReply].limit}/${limitCount}`
    : isPremium
    ? "Unlimited"
    : `${db.data.users[m.sender].limit}/${limitCount}`;
  let gemlimit = m.mentionByReply
    ? `${db.data.users[m.mentionByReply].glimit}/${global.gameCount}`
    : `${db.data.users[m.sender].glimit}/${global.gameCount}`;
  let uang = m.mentionByReply
    ? db.data.users[m.mentionByReply].money.toLocaleString()
    : db.data.users[m.sender].money.toLocaleString();


    const user = global.db.data.users[m.sender]
    let cekL = conn.ms(user.resetLimit - Date.now())
    let sisaL = `${cekL.hours} jam ${cekL.minutes} menit ${cekL.seconds} detik`

  let teks = `
––––––『 *USER LIMIT* 』––––––
        
• Nama: ${name}
• Nomer: ${number}
• Limit : ${limid}
• Game Limit : ${gemlimit}
• Reset Limit : ${sisaL}
• Saldo : Rp ${uang}
        
Kamu dapat membeli limit 
dengan cara ${prefix}buy limit 10

Untuk mendapatkan saldo
kamu bisa mendapatkanya
dengan bermain game`;

  if (m.mentionByReply) {
    setReply(teks);
  } else {
    setReply(teks);
  }
};

handler.tags = ["info"];
handler.command = ["ceklimit", "limit"];

export default handler;
