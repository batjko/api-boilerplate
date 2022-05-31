const config = require('../config')
const pkg = require('../../package.json')

const Sentry = require('@sentry/node')

Sentry.init({
  dsn: config.SENTRY_DSN,
  environment: config.NODE_ENV,
  release: `${pkg.name}@${pkg.version}`,
})

module.exports = Sentry
