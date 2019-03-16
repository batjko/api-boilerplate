const test = require('ava')
const app = require('../index')

const request = require('supertest')

test('/healthCheck', async t => {
  const response = await request(app).get('/healthCheck')
  t.is(response.status, 200)
  t.is(response.type, 'application/json')
  t.is(response.body.message, 'OK')
})
