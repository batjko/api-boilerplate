const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const { log, KoaLogger } = require('./logger')
const { isProd } = require('./config')

const healthCheck = require('./routes/healthCheck')

const app = new Koa()

app.use(
  bodyParser({
    jsonLimit: '10mb',
  }),
)

// logger
app.use(KoaLogger)
app.use(async (ctx, next) => {
  await next()
  const rt = ctx.response.get('X-Response-Time')
  if (!isProd)
    log.debug('Response:\n' + JSON.stringify(ctx.response.body, null, 2))
  log.info(`${ctx.method} ${ctx.url} - ${rt} (${ctx.status})`)
})

// x-response-time
app.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  ctx.set('X-Response-Time', `${ms}ms`)
})

/* *** ROUTES *** */

app.use(healthCheck)

/* *** */

// Errors (must be last of the routes)
app.use(async (ctx, next) => {
  try {
    await next()
    if (ctx.status === 404) {
      ctx.body = { error: 'Not Found' }
    }
  } catch (err) {
    log.error(err.status)
    ctx.status = err.status || 500
    ctx.body = { error: err.message || 'Server Error' }
  }
})

// finally, catch app errors
app.on('error', (err, ctx) => {
  log.error('Server Error', err)

  if (ctx) {
    log.error('Response to client failed', ctx)
  }
})

module.exports = app
