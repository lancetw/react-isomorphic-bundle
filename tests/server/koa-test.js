'use strict'

const app = require('src/server')
const request = require('co-supertest').agent(app.listen())

describe('index', function () {
  describe('read', function () {
    it('GET /', function *() {
      yield request.get('/')
        .expect(200).end()
    })
  })
})
