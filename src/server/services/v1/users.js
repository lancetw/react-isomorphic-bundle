'use strict'

import Resource from 'koa-resource-router'
import validate from 'parameter'
import parse from 'co-body'
import hashids from 'src/shared/utils/hashids-plus'
import RestAuth from 'src/server/passport/auth/rest-auth'
import db from 'src/server/db'
import nunjucks from 'nunjucks'

const User = db.users

export default new Resource('users', {
  // GET /users
  index: function *(next) {
    this.body = nunjucks.render('users/index.html')
  },
  // POST /users
  create: function *(next) {
    let body = yield parse(this)
    const rule = {
      name: { type: 'string', required: false, allowEmpty: true },
      password: { type: 'password', compare: 'passwordCheck' },
      passwordCheck: 'password',
      email: 'email'
    }
    const errors = validate(rule, body)
    if (errors) {
      this.type = 'json'
      this.status = 200
      this.body = errors
      return
    }

    try {
      const user = yield User.create(body)
      this.type = 'json'
      this.status = 201
      this.body = hashids.encodeJson(user)
    } catch (err) {
      this.type = 'josn'
      this.status = 200
      this.body = err
    }

  },
  // GET /users/:user
  show: [ RestAuth, function *(next) {
    const user = yield User.load(this.params.user)
    this.type = 'json'
    this.status = 200
    this.body = hashids.encodeJson(user)
  }],
  // GET /users/:user/edit
  edit: function *(next) {
    this.body = 'users'
  },
  // PUT /users/:user
  update: [ RestAuth, function *(next) {
    let body = yield parse(this)

    const rule = {
      name: { type: 'string', required: false, allowEmpty: true },
      password: { type: 'password', compare: 'passwordCheck' },
      passwordCheck: 'password'
    }
    const errors = validate(rule, body)
    if (errors) {
      this.type = 'json'
      this.status = 200
      this.body = errors
      return
    }

    const user = yield User.update(this.params.user, body)
    this.type = 'json'
    this.status = 201
    this.body = hashids.encodeJson(user)
  }],
  // DELETE /users/:user
  destroy: [ RestAuth, function *(next) {
    const user = yield User.delete(this.params.user)
    this.type = 'json'
    this.status = 200
    this.body = hashids.encodeJson(user)
  }]
})
