const healthCheck = require('./routes/healthCheck')
const { isProd, LOG_LEVEL, redactedFields } = require('./config')
const Sentry = require('./utils/sentry')

const app = require('fastify')({
  bodyLimit: 1048576 * 10, // 10MB
  logger: {
    level: LOG_LEVEL,
    prettyPrint: isProd,
    redact: redactedFields,
  },
})

app.setErrorHandler(async (error, request, reply) => {
  // Log locally
  console.error(error)
  // Send error to Sentry
  Sentry.captureException(error)
  reply.status(500).send({ error: error.message || 'Unknown Server Error' })
})

app.addHook('preHandler', (req, reply, next) => {
  if (req.body) {
    req.log.info({ body: req.body }, 'parsed body')
  }
  next()
})

/* *** ROUTES *** */

app.get('/', {}, (req, reply) => {
  reply
    .code(200)
    .type('text/html')
    .send('Try the <a href="/healthCheck">Health Check</a>.')
})

app.register(healthCheck)

/* *** */

module.exports = app
