const app = require('./app')
const config = require('./config')
const Sentry = require('./utils/sentry')

const {
  app: { serverPort, appName },
} = config

const start = async (name, port) => {
  try {
    await app.listen(port)
    app.log.info(`${name} started on port ${port}...`)
  } catch (error) {
    app.log.error(error)
    Sentry.captureException(error)
    process.exit(1)
  }
}

start(appName, serverPort)
