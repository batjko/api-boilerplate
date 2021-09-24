const {
  CONFIG = '{}',
  LOG_LEVEL = 'info',
  APP_NAME = require(process.cwd() + '/package.json').name,
  NODE_ENV = 'development',
} = process.env

// CONFIG env var can override all configs below
let configOverrides
try {
  configOverrides = JSON.parse(CONFIG)
} catch (e) {
  configOverrides = {}
}

module.exports = {
  app: {
    // @ts-ignore
    appName: require('../package.json').name || 'Service',
    serverPort: 3000,
  },
  redactedFields: [
    'req.headers.authorization',
    '*.password',
    '*.secret',
    'headers.authorization',
  ],
  LOG_LEVEL,
  APP_NAME,
  isProd: NODE_ENV.toLowerCase() === 'production',
  ...configOverrides, // must be last
}
