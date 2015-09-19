import Resource from 'koa-resource-router'
import validate from 'parameter'
import parse from 'co-body'
import hashids from 'src/shared/utils/hashids-plus'
import RestAuth from 'src/server/passport/auth/rest-admin-auth'
import db from 'src/server/db'
import nunjucks from 'nunjucks'

const User = db.admins

export default new Resource('users', {
  // GET /users
  index: function *(next) {
    this.body = nunjucks.render('admins/index.html')
  },
  // POST /users
  create: [ RestAuth, function *(next) {
    const body = yield parse(this)
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
      this.type = 'json'
      this.status = 200
      this.body = err
    }
  }],
  // GET /users/:user
  show: [ RestAuth, function *(next) {
    try {
      if (hashids.decode(this.params.user) !== +this.user.id) {
        throw new Error('user check failed')
      }

      const user = yield User.load(this.params.user)

      this.type = 'json'
      this.status = 200
      this.body = hashids.encodeJson(user)
    } catch (err) {
      this.type = 'json'
      this.status = 404
      this.body = err
    }
  }],
  // GET /users/:user/edit
  edit: function *(next) {
    this.body = 'users'
  },
  // PUT /users/:user
  update: [ RestAuth, function *(next) {
    const body = yield parse(this)

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

    try {
      if (hashids.decode(this.params.user) !== +this.user.id) {
        throw new Error('user check failed')
      }

      const user = yield User.update(this.params.user, body)
      this.type = 'json'
      this.status = 201
      this.body = hashids.encodeJson(user)
    } catch (err) {
      this.type = 'json'
      this.status = 404
      this.body = err
    }
  }],
  // DELETE /users/:user
  destroy: [ RestAuth, function *(next) {
    try {
      const body = yield User.load(this.params.user)
      if (hashids.decode(this.params.user) !== +this.user.id) {
        throw new Error('user check failed')
      }

      const user = yield User.delete(this.params.user)
      this.type = 'json'
      this.status = 200
      this.body = hashids.encodeJson(user)
    } catch (err) {
      this.type = 'json'
      this.status = 404
      this.body = err
    }
  }]
})
