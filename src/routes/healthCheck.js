const Sentry = require('../utils/sentry')

module.exports = async fastify => {
  fastify.all(
    '/healthCheck',
    {
      schema: {
        response: {
          200: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      },
    },
    async () => {
      Sentry.captureEvent({
        message: 'HealthCheck called',
        timestamp: new Date().toISOString(),
      })
      return { message: 'OK' }
    },
  )
}
