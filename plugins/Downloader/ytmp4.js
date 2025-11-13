import savetube from '../../lib/savetube.js'
import axios from 'axios';
import fs from 'fs';
import path from 'path';



let handler = async (m, { command, q, conn, prefix, setReply }) => {
if (!q || !q.startsWith("https")) return setReply(`Masukan link youtube`);
m.reply(mess.wait);
// mediaHelper.js (ESM)


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
      return wrapBuffer(buffer, filename, 'audio/mpeg');
    },
    mp4: async (buffer, filename = 'video.mp4') => {
      return wrapBuffer(buffer, filename, 'video/mp4');
    }
  };
  
  // Helper umum untuk simpan + wrap
  const wrapBuffer = (buffer, filename, mimetype) => {
    const tempDir = './';
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
  
    const tempPath = path.join(tempDir, filename);
    fs.writeFileSync(tempPath, buffer);
  
    return {
      filename,
      mimetype,
      buffer,
      path: tempPath
    };
  };
  

const audio = await savetube.download(q, '720');


const media = await Format.mp4(await BUFFER_URL(audio.result.download)); 
await conn.sendMessage(m.chat, {video: media.buffer,},{quoted:m});



};


handler.command =['ytmp4']
  
export default handler;
















 


 

 

  
  
  
  