 "use strict";
const {
  default: makeWASocket,
  Browsers,
  DisconnectReason,
  fetchLatestBaileysVersion,
} = (await import("baileys")).default;
import chalk from '../modules/chalk.js';
import { spawn } from "child_process";

// Fungsi getDisconnectReason diletakkan di luar
function getDisconnectReason(error) {
  if (!error) return null;

  const str = error?.toString?.() || "";
  if (str.includes("bad session")) return DisconnectReason.badSession;
  if (str.includes("connection closed")) return DisconnectReason.connectionClosed;
  if (str.includes("connection lost")) return DisconnectReason.connectionLost;
  if (str.includes("replaced")) return DisconnectReason.connectionReplaced;
  if (str.includes("logged out")) return DisconnectReason.loggedOut;
  if (str.includes("restart required")) return DisconnectReason.restartRequired;
  if (str.includes("timed out")) return DisconnectReason.timedOut;
  if (str.includes("not-authorized")) return DisconnectReason.loggedOut;
  if (str.includes("invalid session")) return DisconnectReason.badSession;

  if (typeof error?.output?.statusCode === "number") return error.output.statusCode;
  if (typeof error?.statusCode === "number") return error.statusCode;

  return null;
}

export const connectionUpdate = async (connectToWhatsApp, conn, update) => {
  const { version, isLatest } = await fetchLatestBaileysVersion();
  const { connection, lastDisconnect, receivedPendingNotifications, isNewLogin } = update;

  const errorString = lastDisconnect?.error?.toString() || "";
  const reason = getDisconnectReason(lastDisconnect?.error);

  if (connection === "close") {
    console.log(chalk.red(lastDisconnect.error));

    if (errorString.includes("Connection Terminated")) {
      console.log(chalk.red("❌ Detected: Connection Terminated"));
      process.exit(1);
    } else if (lastDisconnect.error == "Error: Stream Errored (ack)") {
      process.exit(1);
    } else if (lastDisconnect.error == "Error: Stream Errored (unknown)") {
      process.exit(1);
    } else if (reason === DisconnectReason.badSession) {
      console.log(`Bad Session File, Please Delete Session and Scan Again`);
      process.exit(1);
    } else if (reason === DisconnectReason.connectionClosed) {
      console.log("[SYSTEM]", chalk.red("Connection closed, reconnecting..."));
      process.exit(1);
    } else if (reason === DisconnectReason.connectionLost) {
      console.log(
        chalk.red("[SYSTEM]", "white"),
        chalk.green("Connection lost, trying to reconnect")
      );
      process.exit(1);
    } else if (reason === DisconnectReason.connectionReplaced) {
      console.log(chalk.red("Connection Replaced, Please Close Other Session"));
      conn.logout();
    } else if (reason === DisconnectReason.loggedOut) {
      console.log(chalk.red(`Device Logged Out, Please Scan Again And Run.`));
      conn.logout();
    } else if (reason === DisconnectReason.restartRequired) {
      process.exit(1);
    } else if (reason === DisconnectReason.timedOut) {
      console.log(chalk.red("Connection TimedOut, Reconnecting..."));
      connectToWhatsApp();
    }
  } else if (connection === "connecting") {
    // optional log
  } else if (connection === "open") {
    if (!global.pairingCode) console.log("✅ Bot WhatsApp is Connected");
    if (global.pairingCode) console.log("✅ Bot WhatsApp is Connected");

    const bot = db.data.others["restart"];
    if (bot) {
      const m = bot.m;
      const from = bot.from;
      await conn.sendMessage(from, { text: "Bot is connected" }, { quoted: m });
      delete db.data.others["restart"];
    }

    async function _quickTest() {
      let test = await Promise.all(
        [
          spawn("ffmpeg"),
          spawn("ffprobe"),
          spawn("ffmpeg", [
            "-hide_banner",
            "-loglevel",
            "error",
            "-filter_complex",
            "color",
            "-frames:v",
            "1",
            "-f",
            "webp",
            "-",
          ]),
          spawn("convert"),
          spawn("magick"),
          spawn("gm"),
          spawn("find", ["--version"]),
        ].map((p) =>
          Promise.race([
            new Promise((resolve) => p.on("close", (code) => resolve(code !== 127))),
            new Promise((resolve) => p.on("error", (_) => resolve(false))),
          ])
        )
      );
      let [ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find] = test;
      let s = (global.support = {
        ffmpeg,
        ffprobe,
        ffmpegWebp,
        convert,
        magick,
        gm,
        find,
      });

      Object.freeze(global.support);

      if (!s.ffmpeg) console.log("❌ ffmpeg is not installed");
      if (s.ffmpeg && !s.ffmpegWebp) console.log("❌ libwebp is not installed");
      if (!s.convert && !s.magick && !s.gm) console.log("❌ imagemagick is not installed");
    }

    _quickTest()
      .then(() => {
        console.log("✅ Quick Test System Done");
        console.log(chalk.red("•·–––––––––––––––––––––––––·•"));
        console.log("");
      })
      .catch(console.error);
  }
};
