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
      return { message: 'OK' }
    },
  )
}
