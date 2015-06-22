'use strict'
/* eslint-disable no-unused-expressions */

import app from 'src/server'
const request = require('co-supertest').agent(app.listen())

import models from 'src/server/db/models'
import db from 'src/server/db'
import { expect } from 'chai'
import hashids from 'src/shared/utils/hashids-plus'

const User = db.users
let token1, token2

before(function *() {
  yield models.sequelize.sync()
})

after(function *() {
  models.sequelize.close()
})

describe('user', function () {
  const user = {
    email: 'lancetw@gmail.com',
    password: '1234567890',
    passwordCheck: '1234567890',
    tos: 'on'
  }

  const user2 = {
    email: 'lancetw@gmail.com',
    password: '1111111111',
    passwordCheck: '1111111111',
    tos: 'on'
  }

  describe('create', function () {
    it('DB: create new user', function *() {
      yield models.users.sync({ force: true })
      yield User.create(user)
    })

    it('DB: create duplicate user', function *() {
      try {
        yield User.create(user2)
      }
      catch (err) {
        expect(err.name).equal('SequelizeUniqueConstraintError')
      }
    })

    it('POST /api/v1/users', function *() {
      yield models.users.sync({ force: true })

      const res = yield request.post('/api/v1/users').send(user)
        .expect(201).end()

      expect(res.body.email).is.equal(user.email)
    })

    it('GET JSON WEB TOKEN1', function *() {
        // JWT
      const res = yield request.post('/api/v1/login')
        .auth('lancetw@gmail.com', '1234567890')
        .end()

      token1 = res.body.token
    })

    it('POST /api/v1/users (user exists)', function *() {
      const res = yield request.post('/api/v1/users').send(user2)
        .expect(200).end()

      expect(res.body.name).is.equal('SequelizeUniqueConstraintError')
      expect(res.body.message).is.equal('Validation error')
    })

    it('bad email', function *() {
      const res = yield request.post('/api/v1/users')
        .send({
          email: 'lancetw',
          password: '1234567890',
          passwordCheck: '1234567890',
          'tos': 'on'
        })
        .expect(200).end()

      expect(res.body[0].message).is.equal('email should be an email')
    })

    it('missing email', function *() {
      const res = yield request.post('/api/v1/users')
        .send({
          password: '12345678',
          passwordCheck: '12345678',
          'tos': 'on'
        })
        .expect(200).end()

      expect(res.body[0].message).is.equal('email required')
    })

    it('bad password', function *() {
      const res = yield request.post('/api/v1/users')
        .send({
          email: 'lancetw@gmail.com',
          password: '1234',
          passwordCheck: '1234',
          'tos': 'on'
        })
        .expect(200).end()

      expect(res.body[0].message).is
        .equal('password length should bigger than 6')
    })

    it('missing password', function *() {
      const res = yield request.post('/api/v1/users')
        .send({ email: 'lancetw@gmail.com' })
        .expect(200).end()

      expect(res.body[0].message).is.equal('password required')
    })
  })

  describe('read', function () {
    const id = 1,
          hid = hashids.encode(id)

    it('GET 401 /api/v1/users/' + hid, function *() {
      const res = yield request.get('/api/v1/users/' + hid)
        .expect(401).end()

      expect(res.body).to.be.empty
    })

    it('GET 401 /api/v1/users/' + hid, function *() {
      const res = yield request.get('/api/v1/users/' + hid)
        .set('Authorization', token1)
        .expect(401).end()

      expect(res.body).to.be.empty
    })

    it('GET /api/v1/users/' + hid, function *() {
      const res = yield request.get('/api/v1/users/' + hid)
        .set('Authorization', 'JWT ' + token1)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200).end()

      expect(res.body.email).is.equal(user.email)

    })
  })

  describe('update', function () {
    const id = 1
    const hid = hashids.encode(id)

    const userModified = {
      name: 'test',
      password: '7777777777',
      passwordCheck: '7777777777'
    }

    it('PUT /api/v1/users/' + hid, function *() {
      const res = yield request.put('/api/v1/users/' + hid)
        .send(userModified)
        .set('Authorization', 'JWT ' + token1)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201).end()

      expect(res.body.email).is.equal(user.email)
    })

    it('GET JSON WEB TOKEN2', function *() {
        // JWT
      const res = yield request.post('/api/v1/login')
        .auth('lancetw@gmail.com', '7777777777')
        .end()

      token2 = res.body.token
    })

    it('PUT /api/v1/users/' + hid + ' (Wrong token)', function *() {
      const res = yield request.put('/api/v1/users/' + hid)
        .send(userModified)
        .set('Authorization', 'JWT ' + token1 + token2)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(401).end()

      expect(res.body).to.be.empty
    })


    it('GET /api/v1/users/' + hid, function *() {
      const res = yield request.get('/api/v1/users/' + hid)
        .set('Authorization', 'JWT ' + token2)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200).end()

      expect(res.body.name).is.equal(userModified.name)
    })
  })

  describe('delete', function () {
    const id = 1
    const hid = hashids.encode(id)

    it('DELETE /api/v1/users/' + hid, function *() {
      const res = yield request.delete('/api/v1/users/' + hid)
        .set('Authorization', 'JWT ' + token2)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200).end()

      expect(res.body.email).is.equal(user.email)
    })

    it('DELETE /api/v1/users/' + hid + ' (Wrong auth)', function *() {
      const res = yield request.delete('/api/v1/users/' + hid)
        .set('Authorization', 'JWT ' + token1 + token2)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(401).end()

      expect(res.body).to.be.empty
    })

    it('GET /api/v1/users/' + hid, function *() {
      const res = yield request.get('/api/v1/users/' + hid)
        .set('Authorization', 'JWT ' + token2)
        .expect(401).end()

      expect(res.body).to.be.empty
    })
  })

  describe('index', function () {

    it('GET /api/v1/users/', function *() {
      yield request.get('/api/v1/users/')
        .expect(200).end()
    })

  })

})
