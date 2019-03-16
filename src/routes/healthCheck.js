const router = require('koa-router')()

router.get('/healthCheck', async ctx => {
  ctx.status = 200
  ctx.body = { message: 'OK' }
})

module.exports = router.routes()
