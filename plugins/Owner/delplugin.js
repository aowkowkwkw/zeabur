import { readdirSync, statSync, unlinkSync, existsSync } from 'fs';
import { join, parse } from 'path';
import fs from "fs-extra";

let handler = async (m, { text, command, usedPrefix }) => {
    if (!text) throw `Nama plugin yang ingin dihapus?\n\nContoh:\n${usedPrefix + command} menu`;

    const pluginFiles = getPluginFiles("./plugins");
    const pluginPath = pluginFiles[text];

    if (!pluginPath) {
        return m.reply(`Plugin *${text}* tidak ditemukan.`);
    }

    try {
        if (existsSync(pluginPath)) {
            unlinkSync(pluginPath); // hapus file plugin
            m.reply(`✅ Plugin *${text}* berhasil dihapus.`);

            // Optional: reload plugin system jika pakai auto-reload
            // delete require.cache[require.resolve(pluginPath)];

        } else {
            m.reply(`❌ File plugin tidak ditemukan.`);
        }
    } catch (err) {
        console.error(err);
        m.reply(`❌ Gagal menghapus plugin *${text}*.\n\n${err.message}`);
    }
};

handler.help = ["delplugin"].map(v => v + " <nama>");
handler.tags = ["host"];
handler.command = /^(delplugin|dp|delplugins)$/i;
handler.owner = true;

export default handler;

function getPluginFiles(folderPath) {
    let files = {};

    function getFilesRecursively(folderPath) {
        const items = readdirSync(folderPath);

        for (let item of items) {
            const itemPath = join(folderPath, item);
            const itemStat = statSync(itemPath);

            if (itemStat.isDirectory()) {
                getFilesRecursively(itemPath); // recursive
            } else if (item.endsWith(".js")) {
                const { name } = parse(item);
                files[name] = itemPath;
            }
        }
    }

    getFilesRecursively(folderPath);
    return files;
}
