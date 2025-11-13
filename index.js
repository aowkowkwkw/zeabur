 import { createRequire } from "module";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import chalk from './modules/chalk.js';
import fs from "fs-extra";
import cluster from "cluster";
import net from "net";
import { EventEmitter } from 'events';

EventEmitter.defaultMaxListeners = 100;

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));

const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";
const isProduction = process.env.NODE_ENV === "production";

let error = 0;
let isRunning = false;
let lastErrorDetail = null; // Simpan detail error terakhir

// Fungsi cek apakah port sudah dipakai
function checkPortInUse(port) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once("error", (err) => {
      if (err.code === "EADDRINUSE") resolve(true);
      else reject(err);
    });
    server.once("listening", () => {
      server.close();
      resolve(false);
    });
    server.listen(port)
  });
}

// Fungsi menjalankan express keep alive server
async function launchKeepAlive() {
  const inUse = await checkPortInUse(PORT);
  if (inUse) {
    console.log(chalk.red(`❌ Port ${PORT} sudah digunakan. Skip launching Express.`));
    return;
  }

  try {
    const express = require("express");
    const app = express();

    app.listen(PORT, HOST, () => {
      console.log(chalk.red("•·–––––––––––––––––––––––––·•"));
      console.log(chalk.green(`✅ Port ${PORT} is open`));
      console.log(chalk.green(`✅ Keep Alive on`));
    });

    app.disable("x-powered-by");
    app.get("/health", (req, res) => res.sendStatus(200));
    app.all("/", (req, res) => {
      const html = fs.readFileSync("./index.html", "utf-8");
      res.end(html);
    });

  } catch (err) {
    console.log(chalk.red("•·–––––––––––––––––––––––––·•"));
    console.log(chalk.red(`❌ Keep Alive failed: ${err.message}`));
  }
}

// Delay utility
const sleep = ms => new Promise(res => setTimeout(res, ms));

// Fungsi utama untuk menjalankan cluster worker
function start(file) {
  if (isRunning) return;
  isRunning = true;

  const args = [join(__dirname, file), ...process.argv.slice(2)];
  cluster.setupMaster({ exec: args[0], args: args.slice(1) });

  const worker = cluster.fork();

  worker.on("message", async (data) => {
    switch (data) {
      case "reset":
      case "null":
      case "SIGKILL":
      case "SIGTERM":
      case "SIGUSR2":
      case "SIGUSR1":
      case "ENOMEM":
      case "SIGBUS":
      case "SIGILL":
      case "SIGFPE":
      case "SIGSEGV":
      case "SIGINT":
      case "SIGABRT":
        console.log(chalk.blue(`💥 Received ${data}, shutting down gracefully...`));
        lastErrorDetail = `Received signal: ${data}`;
        worker.kill();
        await sleep(2000);
        restart(file);
        break;
      case "uptime":
        worker.send(process.uptime());
        break;
    }
  });

  worker.on("exit", async (_, code) => {
    error++;

    const reason = lastErrorDetail || `Exited with code ${code}`;

     
      console.log(chalk.blue("\n♻ Restarting Bot WhatsApp\n"));
      console.log(chalk.red("•·–––––––––––––––––––––––––·•"));

       
    if (error > 4) {
      console.log(chalk.yellowBright(`⏱ Terjadi error lebih dari ${error}x. Delay 1 jam dan catat ke file...`));

      const filePath = join(__dirname, "database", "error5x.json");
      const logData = {
        timestamp: new Date().toISOString(),
        errorCount: error,
        message: `Terjadi error lebih dari ${error}x`,
        reason,
        status: "delayed 1 hour"
      };

      try {
        let existingLogs = [];
        if (fs.existsSync(filePath)) {
          existingLogs = await fs.readJson(filePath);
          if (!Array.isArray(existingLogs)) existingLogs = [];
        }
        existingLogs.push(logData);
        await fs.outputJson(filePath, existingLogs, { spaces: 2 });
        console.log(chalk.green("✅ Log error disimpan ke error5x.json"));
      } catch (e) {
        console.log(chalk.red("❌ Gagal menyimpan log ke error5x.json:"), e.message);
      }

      await sleep(60 * 60 * 1000);
      error = 0;
      lastErrorDetail = null;
    } 
    
    await sleep(3000);
    restart(file);
  });

  worker.on("error", async (err) => {
    console.error(chalk.red(`❌ Error: ${err}`));
    lastErrorDetail = err.stack || err.toString();
    error++;
    await sleep(3000);
    restart(file);
  });
}

function restart(file) {
  isRunning = false;
  start(file);
}

// Mulai semua
launchKeepAlive();
start("main.js");
