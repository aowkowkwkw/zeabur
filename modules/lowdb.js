import { createRequire } from "module";
const require = createRequire(import.meta.url);
 
 let Low, JSONFile;

try {
const { Low } = require("lowdb")
const { JSONFile } = require("lowdb/node")
  Low = Low
  JSONFile = JSONFile
} catch {
  // Gunakan fallback versi buatan sendiri
  const fs = await import('fs/promises');
  const path = await import('path');

  class JSONFileCustom {
    constructor(filename) {
      this.filename = filename;
    }

    async read() {
      try {
        const data = await fs.readFile(this.filename, 'utf-8');
        return JSON.parse(data);
      } catch (err) {
        if (err.code === 'ENOENT') return null;
        if (err instanceof SyntaxError) {
          throw new Error(`JSON parse error in file ${this.filename}: ${err.message}`);
        }
        throw err;
      }
    }

    async write(data) {
      const dir = path.dirname(this.filename);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(this.filename, JSON.stringify(data, null, 2));
    }
  }

  class LowCustom {
    constructor(adapter, defaultData = {}) {
      this.adapter = adapter;
      this.data = defaultData;
    }

    async read() {
      const data = await this.adapter.read();
      if (data && typeof data === 'object') {
        this.data = data;
      }
    }

    async write() {
      await this.adapter.write(this.data);
    }
  }

  Low = LowCustom;
  JSONFile = JSONFileCustom;
}

export { Low, JSONFile };
