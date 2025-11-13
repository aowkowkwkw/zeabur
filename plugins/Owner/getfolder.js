import fs from "fs-extra";
import path from "path";
import archiver from "archiver";

let handler = async (m, { text: q, conn, setReply }) => {
  if (!q) return setReply("Nama foldernya apa?");
  const folderPath = path.resolve(`./${q}`);
  const zipPath = path.resolve(`./${q}.zip`);
  const name = `${q}.zip`;
  const mimetype = "application/zip";
  const jpegThumbnail = fs.readFileSync("./media/thumbnaildokumen.jpg");

  try {
    const folderExists = await fs.pathExists(folderPath);
    if (!folderExists) return setReply("Folder tidak ditemukan");

    const stats = await fs.stat(folderPath);
    if (!stats.isDirectory()) return setReply("Path tersebut bukan folder");

    setReply(mess.wait);

    await new Promise((resolve, reject) => {
      const output = fs.createWriteStream(zipPath);
      const archive = archiver("zip", { zlib: { level: 9 } });

      output.on("close", resolve);
      archive.on("error", reject);
      archive.on("warning", warn => {
        if (warn.code !== "ENOENT") reject(warn);
        else console.warn("Warning: ", warn);
      });

      archive.pipe(output);
      archive.directory(folderPath, false);
      archive.finalize();
    });

    const file = await fs.readFile(zipPath);
    await conn.sendMessage(
      m.chat,
      {
        document: file,
        fileName: name,
        mimetype,
        jpegThumbnail,
      },
      { quoted: m }
    );

    await fs.unlink(zipPath);
  } catch (error) {
    console.error(error);
    setReply(`Error: ${error.message}`);
  }
};

handler.help = ["getfolder"];
handler.tags = ["internet"];
handler.command = /^(getfolder|gfo)$/i;
handler.owner = true;
export default handler;
