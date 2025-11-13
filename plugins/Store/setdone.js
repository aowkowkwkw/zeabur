let handler = async (m, { conn, text, prefix, command }) => {
    if (text) {
    global.db.data.chats[m.chat].sDone = text;
    
    m.reply("Setpending berhasil diatur\n@user (Mention)\n@group (Judul Grup)\n@jam (waktu saat ini)\n@tanggal (Tanggal saat ini)");
        
    } else throw  `Ini Hanya Contoh
.setd Pesanan Sukses
@jam
@tanggal
Pesanan : tahu bulat

Pesanan @user Sukses

Terimakasih Sudah Order Di @group`
      };
     
      handler.command = ['setp','setpending','setproses','setprocess']
      handler.group = true;
      handler.admin = true;
      
      export default handler;