import { createRequire } from "module";
const require = createRequire(import.meta.url);

let chalk;

try {
  chalk = require('chalk');
} catch {
  chalk = new Proxy({}, {
    get: () => new Proxy((text) => text, {
      get: (t, p) => t
    })
  });
}

export default chalk;
