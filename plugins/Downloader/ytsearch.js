 

let handler = async (m, { conn, q, usedPrefix, command,prefix }) => {
    if (!q) return m.reply(`Masukkan query! \n\nContoh: \n${usedPrefix + command} Alan walker faded`);
    //global.db.data.settings[conn.user.jid].loading ? await m.reply(global.config.loading) : false;
    m.reply(wait)
    const { ytsearch } = require('ruhend-scraper')

 
try{
    var { video } = await ytsearch(q)
} catch(err){

    var { video } = await ytsearch(q)
    
}
   




  // log(video)
      let text = [...video].map(v => {
         switch (v.type) {
            case 'video':
return `
*${v.title}* 
*${v.url}*
Duration: ${v.durationH}
Uploaded ${v.publishedTime}
${v.view} views`.trim()

}
}).filter(v => v).join(
'\n\n─────────────━─────────────\n\n'
)
 


conn.sendMessage(m.chat, {
    text,
    contextInfo: {
    externalAdReply: {
    title: `YOUTUBE SEARCH`,
    body: "Success Message",
    thumbnailUrl: "https://searchengineland.com/wp-content/seloads/2014/08/youtube-iconsbkgd-1920-800x450.jpg",
    sourceUrl: "",
    mediaType: 1,
    renderLargerThumbnail: true
    }
    }},{quoted:m})


}

handler.help = ['ytsearch'];
handler.tags = ['search'];
handler.command = ['yts','ytsearch']
handler.limit = true;

export default handler;