import savetube from '../../lib/savetube.js'
import axios from 'axios';
import fs from 'fs';
import path from 'path';



let handler = async (m, { command, q, conn, prefix, setReply }) => {
if (!q || !q.startsWith("https")) return setReply(`Masukan link youtube`);
m.reply(mess.wait);
const BUFFER_URL = async (url) => {
    try {
      const { data } = await axios.get(url, { responseType: 'arraybuffer' });
      return Buffer.from(data);
    } catch (err) {
      throw new Error(`Gagal fetch URL: ${err.message}`);
    }
  };
  
  const Format = {
    mp3: async (buffer, filename = 'audio.mp3') => {
      // Simpan file ke folder tmp (jika belum ada, buat dulu)
      const tempDir = './';
      if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
  
      const tempPath = path.join(tempDir, filename);
      fs.writeFileSync(tempPath, buffer);
  
      return {
        filename,
        mimetype: 'audio/mpeg',
        buffer,
        path: tempPath
      };
    }
  };

const audio = await savetube.download(q, 'mp3');


const media = await Format.mp3(await BUFFER_URL(audio.result.download)); 
await conn.sendMessage(m.chat, {
    audio: media.buffer,
    mimetype: media.mimetype,
    ptt: false
  },{quoted:m});







};


handler.command =['ytmp3']
  
export default handler;

















 

 

  
  
  
  