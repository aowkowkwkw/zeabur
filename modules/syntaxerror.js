import { createRequire } from 'module'
import { Script } from 'vm'

const require = createRequire(import.meta.url)

let syntaxerror

try {
  syntaxerror = require('syntaxerror')
} catch {
  syntaxerror = checkSyntaxError // fallback ke fungsi lokal
}

export default syntaxerror

/**
 * Mengecek syntax error pada kode JavaScript (fallback lokal).
 * @param {string} src - Source code JS yang akan dicek.
 * @param {string} [filename='input.js'] - Nama file untuk referensi (opsional).
 * @returns {null|object} - Null jika tidak ada error, object jika ada error.
 */
function checkSyntaxError(src, filename = 'input.js') {
  if (typeof src !== 'string') {
    throw new TypeError('Parameter "src" harus berupa string')
  }

  // Cek kasar syntax ESM dengan regex
  if (/^\s*(import|export)\s/m.test(src)) {
    // Jangan coba parsing dengan vm.Script karena pasti error
    return {
      message: 'ESM syntax (import/export) tidak didukung dalam vm.Script',
      line: 1,
      column: 1,
      name: 'SyntaxError',
      toString: () => 'SyntaxError: ESM syntax tidak bisa diparsing dengan vm.Script',
      annotated: `${filename}:1\n(import/export)\n^\nSyntaxError: ESM syntax tidak bisa diparsing dengan vm.Script`
    }
  }

  // Untuk non-ESM, coba parse dengan vm.Script
  try {
    new Script(src, { filename })
    return null
  } catch (err) {
    const line = err.lineNumber || 0
    const col = err.columnNumber || 0
    const lines = src.split('\n')
    const errorLine = lines[line - 1] || ''
    const pointer = ' '.repeat(Math.max(0, col - 1)) + '^'

    const annotated = [
      `${filename}:${line}`,
      errorLine,
      pointer,
      `${err.name}: ${err.message}`
    ].join('\n')

    return {
      message: err.message,
      line,
      column: col,
      name: err.name,
      stack: err.stack,
      toString: () => `${err.name} at ${filename}:${line}:${col} - ${err.message}`,
      annotated
    }
  }
}


