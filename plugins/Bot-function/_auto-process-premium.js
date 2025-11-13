let handler = (m) => m;

handler.before = async function (m, { conn,isPremium }) {
    /*
    const isImage = m.type === "imageMessage";
    const isVideo = m.type === "videoMessage";
    const p = m.quoted ? m.quoted : m 

if ((isImage || isVideo) && isPremium) {
    if (quoted.seconds > 11) return 
    const media = await p.download(true)
    conn.toSticker(m.chat, media, m);
}
*/
};
export default handler;
