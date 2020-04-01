const app = require('./app')
const config = require('./config')

const {
  app: { serverPort, appName },
} = config

const start = async (name, port) => {
  try {
    await app.listen(serverPort)
    app.log.info(`${name} started on port ${port}...`)
  } catch (error) {
    app.log.error(error)
    process.exit(1)
  }
}

start(appName, serverPort)
