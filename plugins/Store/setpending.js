let handler = async (m, { conn, text, prefix, command }) => {
if (text) {
global.db.data.chats[m.chat].sPending = text;

m.reply("Setpending berhasil diatur\n@user (Mention)\n@group (Judul Grup)\n@jam (waktu saat ini)\n@tanggal (Tanggal saat ini)");
    
} else throw  `Ini Hanya Contoh
.setp Pesanan Proses
@jam
@tanggal
Pesanan : tahu bulat

Pesanan @user Sedang Di Proses`
  };
 
  handler.command = ['setp','setpending','setproses','setprocess']
  handler.group = true;
  handler.admin = true;
  
  export default handler;