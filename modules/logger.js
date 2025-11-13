const loggerFactory = (tag = '') => ({
  currentLevel: 'fatal', // default fatal, jadi trace tidak muncul

  setLevel(level) {
    this.currentLevel = level
  },

  get level() {
    return this.currentLevel
  },

  child(ctx = {}) {
    const prefix = ctx.tag || ctx.module || ctx.name || ''
    return loggerFactory(prefix ? `[${prefix.toUpperCase()}]` : '')
  },

  _log(level, ...args) {
    const levels = ['trace', 'debug', 'info', 'warn', 'error', 'fatal']
    if (levels.indexOf(level) < levels.indexOf(this.currentLevel)) return

    const colors = {
      gray: '\x1b[90m',
      blue: '\x1b[34m',
      yellow: '\x1b[33m',
      red: '\x1b[31m',
      magenta: '\x1b[35m',
      reset: '\x1b[0m',
    }

    const config = {
      trace: { color: colors.gray, emoji: '🔍' },
      debug: { color: colors.gray, emoji: '🐛' },
      info:  { color: colors.blue, emoji: 'ℹ️' },
      warn:  { color: colors.yellow, emoji: '⚠️' },
      error: { color: colors.red, emoji: '❌' },
      fatal: { color: colors.magenta, emoji: '💀' },
    }

    const { color, emoji } = config[level] || {}
    const reset = colors.reset
    const label = `[${emoji} ${level.toUpperCase()}]`.padEnd(12)
    const prefix = tag.padEnd(8)
    const message = args.map(a => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ')
    const output = `${color}${label}${prefix}${reset} ${message}`

    console.log(output)
  },

  trace(...args) { this._log('trace', ...args) },
  debug(...args) { this._log('debug', ...args) },
  info(...args)  { this._log('info', ...args) },
  warn(...args)  { this._log('warn', ...args) },
  error(...args) { this._log('error', ...args) },
  fatal(...args) { this._log('fatal', ...args) },
})

const logger = loggerFactory()

// Jika kamu ingin ubah level di runtime, lakukan ini:
// logger.setLevel('fatal')

export default logger
