const { isProd, LOG_LEVEL } = require('./config')
const app = require('fastify')({
  bodyLimit: 1048576 * 10, // 10MB
  logger: {
    level: LOG_LEVEL,
    prettyPrint: isProd,
    redact: ['req.headers.authorization'],
  },
})

app.addHook('preHandler', (req, reply, next) => {
  if (req.body) {
    req.log.info({ body: req.body }, 'parsed body')
  }
  next()
})

const healthCheck = require('./routes/healthCheck')

/* *** ROUTES *** */

app.register(healthCheck)

/* *** */

module.exports = app
