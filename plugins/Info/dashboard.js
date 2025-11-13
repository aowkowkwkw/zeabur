 
import { runtime, FileSize } from "../../lib/myfunc.js";

let handler = async (m, { conn, setReply }) => {
  try {
    const hitnya = db.data.hittoday;
    const dash = db.data.dashboard;
    let storage = await conn.getDirSize(process.cwd());
    let moduls = await conn.getDirSize("./node_modules");
    let Session = await conn.getDirSize(global.session);
    let databse = await conn.getFileSize("./database/database.json");

    let gcHit = `\n\n––––––『 Group Hit 』––––––\n`
    let data = db.data.chats;
    for (let key in data) {
        if (data[key].hasOwnProperty('hit')) {
          gcHit += '⭔ ' + data[key].name + " : " + data[key].hit + '\n';
        }
    }

    let totalHit = Object.values(data).reduce((acc, chat) => acc + (chat.hit || 0), 0);

    // Hitung waktu reset
    let resetTime = hitnya.map(i => conn.ms(i.expired - Date.now()));
    let resetnye = resetTime.reduce((acc, cekvipp) => `${acc}${cekvipp.hours} jam ${cekvipp.minutes} menit, `, '').slice(0, -2);

    let teks = `
––––––『 Dashboard 』––––––
⭔ Runtime: ${runtime(process.uptime())}
⭔ Reset: ${resetnye}
⭔ Total Hit: ${totalHit.toLocaleString()}
⭔ Storage: ${FileSize(storage)}
⭔ Modules: ${FileSize(moduls)}
⭔ Session: ${FileSize(Session)}
⭔ Database: ${FileSize(databse)}
`;

    // Buat teks untuk commands today
    let commandsTodayText = "––––––『 Commands Today 』––––––\n";
    dash.forEach(e => commandsTodayText += ` ⭔ ${e.cmd} : ${e.succes + e.failed}\n`);
    let totalCommandsUsed = `Total : ${dash.length} used`;

    // Buat teks untuk commands failed
    let failedCommandsText = "––––––『 Commands Failed 』––––––\n";
    let filteredArray = dash.filter(item => item.failed > 0);
    filteredArray.forEach(e => failedCommandsText += ` ⭔ ${e.cmd} : ${e.failed}\n`);
    let failedCommandsTotal = `Total : ${filteredArray.length} failed`;

    // Hitung total success dan total failed
    let totalSuc = dash.reduce((acc, cur) => acc + cur.succes, 0);
    let totalFail = dash.reduce((acc, cur) => acc + cur.failed, 0);

    let tekz =
      teks +
      "\n\n" +
      commandsTodayText +
      "\n" +
      totalCommandsUsed +
      "\n\n" +
      "––––––『 Commands Status 』––––––\n" +
      ` ⭔ Success : ${totalSuc}\n` +
      ` ⭔ Failed : ${totalFail}\n\n` +
      failedCommandsText + 
      gcHit +
      "\n\n";

    let link = "https://telegra.ph/file/b659d66189445cab43a25.jpg";
    setReply(tekz);
  } catch (error) {
    console.error("Error in dashboard handler:", error);
    setReply("Oops! Terjadi kesalahan dalam menampilkan dashboard.");
  }
};

handler.help = ["db"];
handler.tags = ["spesifikasi"];
handler.command = /^(dashboard)$/i;

export default handler;
