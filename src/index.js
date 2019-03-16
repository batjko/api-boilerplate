const app = require('./app')
const config = require('./config')
const { log } = require('./logger')

const {
  app: { serverPort, appName },
} = config

const server = app.listen(serverPort, () =>
  log.info(`${appName} started on port ${serverPort}...`),
)

module.exports = server
