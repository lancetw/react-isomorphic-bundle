'use strict'
/* eslint-disable no-unused-expressions */
import app from 'src/server'
const request = require('co-supertest').agent(app.listen())

import models from 'src/server/db/models'
import db from 'src/server/db'
import { expect } from 'chai'
import hashids from 'src/shared/utils/hashids-plus'

const bcrypt = require('co-bcryptjs')
import { locations } from 'src/server/db'

let local1
let local2
let local3

before(function *() {
  yield models.sequelize.sync()
  local1 = {
    'postId': 1,
    'geometry': [121.5627981, 25.0334017]
  }

  local2 = {
    'postId': 2,
    'geometry': [121.5627981, 25.0334017]
  }

  local3 = {
    'postId': 3,
    'geometry': [121.5627981, 25.0334017]
  }
})

after(function *() {
  models.sequelize.close()
})

// SQlite don't supports this provider.
describe('locations provider', function () {
  describe('basic', function () {
    it('create', function *() {
      try {
        yield locations.create(local1.postId, local1)
      } catch (err) {
        expect(err.name).equal('SequelizeDatabaseError')
      }
    })

    it('createOrUpdate', function *() {
      try {
        yield locations.createOrUpdate(local1.postId, local1)
      } catch (err) {
        expect(err.name).equal('SequelizeDatabaseError')
      }
    })

    it('destroy', function *() {
      try {
        yield locations.destroy(local1.postId)
      } catch (err) {
        expect(err.name).equal('TypeError')
      }
    })

    it('nearBy', function *() {
      try {
        yield locations.create(local1)
        yield locations.create(local2)
        yield locations.create(local3)
        yield locations.nearBy(local1.postId)
      } catch (err) {
        expect(err.name).equal('SequelizeDatabaseError')
      }
    })
  })

})
