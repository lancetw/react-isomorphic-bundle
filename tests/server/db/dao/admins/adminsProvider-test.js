'use strict'
/* eslint-disable no-unused-expressions */
import app from 'src/server'
const request = require('co-supertest').agent(app.listen())

import models from 'src/server/db/models'
import db from 'src/server/db'
import { expect } from 'chai'
import hashids from 'src/shared/utils/hashids-plus'

const bcrypt = require('co-bcrypt')
import { admins } from 'src/server/db'

let id
let hid
let salt
let password
let user

before(function *() {
  yield models.sequelize.sync()

  id = 1
  hid = hashids.encode(id)
  salt = yield bcrypt.genSalt(10)
  password = yield bcrypt.hash('testonly', salt)
  user = {
    'email': 'test@test.test',
    'name': 'test admin',
    'password': password,
    'comment': 'TEST ONLY'
  }
})

after(function *() {
  models.sequelize.close()
})

describe('admins provider', function () {
  describe('basic', function () {
    it('create', function *() {
      const res = yield admins.create(user)
      expect(res.name).equal(user.name)
    })

    it('load', function *() {
      const res = yield admins.load(hid)
      expect(res.name).equal(user.name)
    })

    it('loadByEmail', function *() {
      const res = yield admins.loadByEmail(user.email)
      expect(res.name).equal(user.name)
    })

    it('update', function *() {
      const newData = { name: 'new name' }
      const res = yield admins.update(hid, newData)
      expect(res.name).equal(newData.name)
    })

    it('auth', function *() {
      const res = yield admins.auth(user.email, user.password)
      expect(res.id).equal(id)
    })

    it('listAllWithCount', function *() {
      const res = yield admins.listAllWithCount(0, 10)
      expect(res.count).equal(1)
    })

    it('searchWithCount', function *() {
      const pattern = 'test'
      const status = 0
      const res = yield admins.searchWithCount(0, 10, pattern, status)
      expect(res.count).equal(1)
    })

    it('count', function *() {
      const res = yield admins.count()
      expect(res).equal(1)
    })

    it('delete', function *() {
      const res = yield admins.delete(hid)
      expect(res.id).equal(id)
    })
  })

})
