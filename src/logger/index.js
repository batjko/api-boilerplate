const pino = require('pino')
const koaPino = require('koa-pino-logger')

const { redactedFields, LOG_LEVEL, APP_NAME, isProd } = require('../config')

let Logger = MainLogger()

function MainLogger() {
  const logger = pino({
    level: LOG_LEVEL,
    base: { appname: APP_NAME },
    prettyPrint: !isProd ? { colorize: true } : false,
    redact: {
      censor: '******',
      paths: redactedFields,
    },
    // translate from numeric levels when not already pretty-printing
    useLevelLabels: isProd,
    timestamp: () => `,"time": "${new Date().toISOString()}"`,
    messageKey: isProd ? 'message' : 'msg', // msg prints nicer in Dev mode
  })

  // with my dying breath, I spit my logs at thee!
  const finalLogger = isProd
    ? pino.final(logger, (err, finalLogger) => {
        finalLogger.error(err, 'uncaughtException')
        process.exit(1)
      })
    : err => console.error(err)

  process.on('uncaughtException', finalLogger)
  return logger
}

// create module-specific child loggers
function createModuleLogger(moduleName) {
  if (!Logger) Logger = MainLogger()

  if (!moduleName)
    Logger.warn('ModuleLogger() initialised without a moduleName.')

  return Logger.child({ module: moduleName || 'unspecified' })
}

// Package API
module.exports = {
  KoaLogger: koaPino({ logger: Logger }),
  log: Logger,
  createModuleLogger,
}
