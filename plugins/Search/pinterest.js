import axios from 'axios';
import {
  generateWAMessageFromContent,
  prepareWAMessageMedia,
} from 'baileys';

const SERPAPI_KEY = global.serApi // Kosongkan jika ingin pakai module g-i-s

let handler = async (m, { conn, q, args, command, prefix }) => {
  if (!q)
    return m.reply(
      `Kirim perintah ${command} query atau ${command} query --jumlah\nContoh:\n${command} aesthetic atau ${command} aesthetic --10`
    );

  m.reply("🔍 Sedang mencari gambar...");

  let jumlah = 5;
  if (q.includes("--")) {
    const parts = q.split("--");
    q = parts[0].trim();
    jumlah = parseInt(parts[1]) || 5;
  }

  let data = await pinterest(q, m);
  if (!data.result.length) return m.reply("❌ Tidak ditemukan gambar!");

  let result = data.result.slice(0, jumlah);

  let nextButton = !m.isGroup
    ? {
        name: "quick_reply",
        buttonParamsJson: `{"display_text":"Next","title":"Next","id":"${prefix}pinterest ${q}"}`,
      }
    : {};

  let cards = await Promise.all(
    result.map(async (url) => {
      return {
        header: {
          hasMediaAttachment: true,
          ...(await prepareWAMessageMedia(
            { image: { url } },
            { upload: conn.waUploadToServer }
          )),
        },
        body: { text: q },
        nativeFlowMessage: {
          buttons: [
            nextButton,
            {
              name: "cta_url",
              buttonParamsJson: `{"display_text":"Url","url":"${url}","merchant_ur":"${url}"}`,
            },
          ],
        },
      };
    })
  );

  const msg = generateWAMessageFromContent(
    m.chat,
    {
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            body: {
              text: "📌 Hasil pencarian Pinterest",
            },
            carouselMessage: {
              cards,
              messageVersion: 1,
            },
          },
        },
      },
    },
    { quoted: m }
  );

  await conn.relayMessage(msg.key.remoteJid, msg.message, {
    messageId: msg.key.id,
  });
};

handler.help = ["pinterest"];
handler.tags = ["info"];
handler.premium = true;
handler.command = /^(pinterest)$/i;
export default handler;

// === Hybrid Pinterest Scraper ===
async function pinterest(query, m) {
  if (SERPAPI_KEY) {
    // 🔵 Gunakan SerpApi jika tersedia
    try {
      const res = await axios.get('https://serpapi.com/search', {
        params: {
          engine: 'google',
          q: `${query} site:pinterest.com`,
          tbm: 'isch',
          api_key: SERPAPI_KEY,
          tbs: 'isz:lt,islt:2mp',
        },
      });

      const result = res.data.images_results
        .map((x) => x.original)
        .filter((x) => x && x.startsWith('https'));

      return {
        status: 200,
        creator: 'officialdittaz',
        result,
      };
    } catch (e) {
      console.error(e);
      return { status: 500, result: [] };
    }
  } else {
    // 🔄 Fallback ke module g-i-s jika tidak ada API Key
    try {
      const gis = require('g-i-s') 
      return new Promise((resolve) => {
        gis({ searchTerm: query + ' site:pinterest.com' }, (err, res) => {
          if (err || !res || !res.length) {
            resolve({ status: 500, result: [] });
          } else {
            resolve({
              status: 200,
              creator: 'officialdittaz',
              result: res.map((v) => v.url).filter((x) => x && x.startsWith('http')),
            });
          }
        });
      });
    } catch (e) {
      console.error("❌ Module g-i-s tidak ditemukan:", e.message);
      m.reply("❗ Gagal mencari gambar. Silakan isi SERPAPI_KEY atau install module `g-i-s` terlebih dahulu:\n\n```bash\nnpm install g-i-s\n```");
      return { status: 500, result: [] };
    }
  }
}
