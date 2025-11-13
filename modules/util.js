// util.js (ESM) lengkap dengan tambahan

export function format(fmt, ...args) {
  fmt = String(fmt)
  return fmt.replace(/%[sdj%]/g, (x) => {
    if (x === '%%') return '%'
    if (!args.length) return x
    switch (x) {
      case '%s': return String(args.shift())
      case '%d': return Number(args.shift())
      case '%j':
        try {
          return JSON.stringify(args.shift())
        } catch {
          return '[Circular]'
        }
      default:
        return x
    }
  })
}


export function inspect(obj, opts = {}) {
  const depth = opts.depth ?? 2
  const seen = new WeakSet()

  function formatValue(value, d, indent = '') {
    const nextIndent = indent + '  '

    if (value === null || typeof value !== 'object') return JSON.stringify(value)
    if (seen.has(value)) return '[Circular]'
    if (d < 0) return '[Object]'
    
    seen.add(value)

    if (Array.isArray(value)) {
      if (value.length === 0) return '[]'
      const items = value.map(v => `${nextIndent}${formatValue(v, d - 1, nextIndent)}`)
      return `[\n${items.join(',\n')}\n${indent}]`
    }

    const entries = Object.entries(value).map(
      ([k, v]) => `${nextIndent}${k}: ${formatValue(v, d - 1, nextIndent)}`
    )
    return `{\n${entries.join(',\n')}\n${indent}}`
  }

  return formatValue(obj, depth)
}



export function promisify(fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      fn(...args, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  };
}

export function callbackify(fn) {
  return function (...args) {
    const cb = args.pop();
    fn(...args).then((res) => cb(null, res)).catch(cb);
  };
}

export function inherits(ctor, superCtor) {
  ctor.prototype = Object.create(superCtor.prototype);
  ctor.prototype.constructor = ctor;
}

export function debuglog(section) {
  const enabled = (process.env.NODE_DEBUG || '').split(',').includes(section);
  return function (...args) {
    if (enabled) {
      console.log(`[${section.toUpperCase()}]`, ...args);
    }
  };
}

// TextEncoder & TextDecoder (Web API polyfill untuk Node.js < 11)
export const TextEncoder = global.TextEncoder || class {
  encode(str) {
    const buf = [];
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i);
      if (code < 0x80) buf.push(code);
      else if (code < 0x800) {
        buf.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
      } else if (code < 0xd800 || code >= 0xe000) {
        buf.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
      } else {
        // surrogate pair
        i++;
        const next = str.charCodeAt(i);
        const surrogate = 0x10000 + (((code & 0x3ff) << 10) | (next & 0x3ff));
        buf.push(
          0xf0 | (surrogate >> 18),
          0x80 | ((surrogate >> 12) & 0x3f),
          0x80 | ((surrogate >> 6) & 0x3f),
          0x80 | (surrogate & 0x3f)
        );
      }
    }
    return new Uint8Array(buf);
  }
};

export const TextDecoder = global.TextDecoder || class {
  decode(buf) {
    let result = '';
    let i = 0;
    while (i < buf.length) {
      const byte1 = buf[i++];
      if (byte1 < 0x80) {
        result += String.fromCharCode(byte1);
      } else if (byte1 > 0xc1 && byte1 < 0xe0) {
        const byte2 = buf[i++];
        result += String.fromCharCode(((byte1 & 0x1f) << 6) | (byte2 & 0x3f));
      } else if (byte1 > 0xdf && byte1 < 0xf0) {
        const byte2 = buf[i++];
        const byte3 = buf[i++];
        result += String.fromCharCode(
          ((byte1 & 0x0f) << 12) |
          ((byte2 & 0x3f) << 6) |
          (byte3 & 0x3f)
        );
      } else if (byte1 > 0xef && byte1 < 0xf8) {
        const byte2 = buf[i++];
        const byte3 = buf[i++];
        const byte4 = buf[i++];
        // decode surrogate pair to chars
        let codepoint =
          ((byte1 & 0x07) << 18) |
          ((byte2 & 0x3f) << 12) |
          ((byte3 & 0x3f) << 6) |
          (byte4 & 0x3f);
        codepoint -= 0x10000;
        result += String.fromCharCode(
          0xd800 + (codepoint >> 10),
          0xdc00 + (codepoint & 0x3ff)
        );
      }
    }
    return result;
  }
};

// toUSVString: aman untuk Unicode (mirip util.toUSVString)
export function toUSVString(input) {
  let result = '';
  for (let i = 0; i < input.length; i++) {
    const code = input.charCodeAt(i);
    if (code >= 0xd800 && code <= 0xdbff) {
      const next = input.charCodeAt(i + 1);
      if (next >= 0xdc00 && next <= 0xdfff) {
        result += input[i] + input[i + 1];
        i++;
        continue;
      }
      result += '\uFFFD'; // replacement char
    } else if (code >= 0xdc00 && code <= 0xdfff) {
      result += '\uFFFD'; // replacement char
    } else {
      result += input[i];
    }
  }
  return result;
}

// parseArgs sederhana untuk CLI
// config: { options: { name: { type: 'string'|'boolean'|'number', alias?, default? } } }
export function parseArgs({ options }, argv = process.argv.slice(2)) {
  const result = { values: {}, positionals: [] };
  const opts = options || {};

  const aliases = {};
  for (const key in opts) {
    if (opts[key].alias) {
      aliases[opts[key].alias] = key;
    }
  }

  let i = 0;
  while (i < argv.length) {
    const arg = argv[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const optKey = opts[key] ? key : aliases[key];
      if (!optKey) {
        i++;
        continue;
      }
      const type = opts[optKey].type;
      if (type === 'boolean') {
        result.values[optKey] = true;
        i++;
      } else {
        result.values[optKey] = argv[i + 1];
        i += 2;
      }
    } else if (arg.startsWith('-')) {
      const key = arg.slice(1);
      const optKey = aliases[key];
      if (!optKey) {
        i++;
        continue;
      }
      const type = opts[optKey].type;
      if (type === 'boolean') {
        result.values[optKey] = true;
        i++;
      } else {
        result.values[optKey] = argv[i + 1];
        i += 2;
      }
    } else {
      result.positionals.push(arg);
      i++;
    }
  }

  // assign defaults if not set
  for (const key in opts) {
    if (result.values[key] === undefined && opts[key].default !== undefined) {
      result.values[key] = opts[key].default;
    }
  }

  return result;
}


export default {
  format,
  inspect,
  promisify,
  callbackify,
  inherits,
  debuglog,
  TextEncoder,
  TextDecoder,
  toUSVString,
  parseArgs
}