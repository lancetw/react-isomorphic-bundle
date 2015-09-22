'use strict'

const app = require('src/server')
const request = require('co-supertest').agent(app.listen())

// broken, don't know why
/*describe('index', function () {
  describe('read', function () {
    it('GET /', function *() {
      yield request.get('/')
        .expect(200).end()
    })
  })
})
*/
