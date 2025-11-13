 let handler = async (m, { conn, command, args }) => {
    if (!m.isGroup) return m.reply('❗Fitur ini hanya bisa digunakan di dalam grup!');
    if (!m.quoted) return m.reply('⚠️ Balas pesan yang ingin dipin!');
    if (!m.isGroupAdmin) return m.reply('🚫 Hanya admin grup yang bisa mem-pin pesan!');
  
    const duration = parseInt(args[0]) || 86400; // default 1 hari
    const key = m.quoted.key;
  
    try {
      await conn.sendMessage(m.chat, {
        pin: {
          type: 1, // 0 untuk unpin
          time: duration, // dalam detik
          key: key
        }
      });
  
      m.reply(`📌 Pesan berhasil dipin selama ${duration} detik!`);
    } catch (e) {
      console.error(e);
      m.reply('❌ Gagal melakukan pin pesan!');
    }
  };
  
  handler.help = ['pinmsg <detik>'];
  handler.tags = ['group'];
  handler.command = ['pin','pinmsg']
  handler.group = true;
  handler.admin = true;
  handler.botAdmin = true;
  

  export default handler