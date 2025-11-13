import { generateProfilePicture } from "../../lib/myfunc.js";
import fs from 'fs-extra'
let handler = async (m, { conn, q, setReply, isOwner,command }) => {
  const isImage = m.type === "imageMessage";
  const isQuotedImage =
    m.type === "extendedTextMessage" && m.content.includes("imageMessage");
  const p = m.quoted ? m.quoted : m 
  if (!isOwner) return setReply(mess.only.owner);
  if (isImage || isQuotedImage) {

    if (q == "full") {
      let { S_WHATSAPP_NET } = require("baileys")
      log('download FIle')
      const bufffer = await p.download(true)
      log('Generate')
      const { img } = await generateProfilePicture(bufffer);
       
log("prosesconn.query")
      await conn.query({ 
            tag: 'iq', attrs: { 
                to: S_WHATSAPP_NET, 
                type: 'set', 
                xmlns: 'w:profile:picture' 
            }, content: [{ tag: 'picture', attrs: { type: 'image' }, 
                content: img }] 
            })
      await setReply("Sukses");

    } else if (q == "full2") {

        let { S_WHATSAPP_NET } = require("baileys")
      log('download FIle')
      const bufffer = await p.download()
      log('Generate')
      const { img } = await generateProfilePicture(bufffer);
       
log("prosesconn.query")
      await conn.query({ 
            tag: 'iq', attrs: { 
                to: S_WHATSAPP_NET, 
                type: 'set', 
                xmlns: 'w:profile:picture' 
            }, content: [{ tag: 'picture', attrs: { type: 'image' }, 
                content: img }] 
            })
      await setReply("Sukses");

    } else{
      let media = await p.download(true)
      let data = await conn.updateProfilePicture(m.botNumber, { url: media });
      fs.unlinkSync(media);
      setReply(`Sukses`);
    }
  } else setReply(`Kirim/balas gambar dengan caption ${command} untuk mengubah foto profil bot`);
  
};
handler.help = ["user"];
handler.tags = ["owner"];
handler.command = ["setppbot"];

export default handler;
