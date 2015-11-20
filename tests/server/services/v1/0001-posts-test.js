'use strict'
/* eslint-disable no-unused-expressions */
import app from 'src/server'
const request = require('co-supertest').agent(app.listen())

import models from 'src/server/db/models'
import db from 'src/server/db'
import { expect } from 'chai'
import hashids from 'src/shared/utils/hashids-plus'

const User = db.users
const Post = db.posts
let token1, token2

before(function *() {
  yield models.sequelize.sync()
})

after(function *() {
  models.sequelize.close()
})

describe('post', function () {
  const user = {
    email: 'lancetw@gmail.com',
    password: '1234567890',
    passwordCheck: '1234567890',
    tos: 'on',
    recaptcha: 'test only'
  }

  const post = {
    'uid': 1,
    'type': 0,
    'prop': 0,
    'startDate': new Date(),
    'endDate': new Date(),
    'openDate': new Date(),
    'closeDate': new Date(),
    'dateType': null,
    'title': 'TEST',
    'content': 'TEST ONLY',
    'file': null,
    'lat': null,
    'lng': null,
    'place': null,
    'url': null,
    'status': null,
    'ocname': null,
    'cid': null
  }

  describe('create', function () {
    it('DB: create new user', function *() {
      yield models.users.sync({ force: true })
      const u = yield User.create(user)
      expect(u.email).equal(user.email)
    })

    it('DB: create new post', function *() {
      yield models.posts.sync({ force: true })
      const p = yield Post.create(post)
      expect(p.title).equal(post.title)
    })
  })

  describe('read', function () {
    it('DB: read a post', function *() {
      const hid = hashids.encode(post.uid)
      const p = yield Post.load(hid)
      expect(p.title).equal(post.title)
    })
  })

  describe('update', function () {
    it('DB: update a post', function *() {
      const newContent = { 'content': 'NEW CONTENT' }
      const hid = hashids.encode(post.uid)
      const p = yield Post.update(hid, newContent)
      expect(p.content).equal(newContent.content)
    })
  })

  describe('delete', function () {
    it('DB: delete a post', function *() {
      const hid = hashids.encode(post.uid)
      const p = yield Post.destroy(hid)
      expect(p.title).equal(post.title)
    })
  })
})
