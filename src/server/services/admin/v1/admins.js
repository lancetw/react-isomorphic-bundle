import Resource from 'koa-resource-router'
import validate from 'parameter'
import parse from 'co-body'
import hashids from 'src/shared/utils/hashids-plus'
import RestAuth from 'src/server/passport/auth/rest-auth'
import db from 'src/server/db'
import queryType from 'query-types'
import { each } from 'lodash'
import co from 'co'

const User = db.admins

export default new Resource('admins', {
  // GET /admins
  index: [ RestAuth, function *(next) {
    const body = queryType.parseObject(this.request.query)
    const rule = {
      offset: { type: 'number', required: false },
      limit: { type: 'number', required: false },
      status: { type: 'number', required: false }
    }
    const errors = validate(rule, body)
    if (errors) {
      this.type = 'json'
      this.status = 200
      this.body = { errors: errors }
      return
    }

    const { offset, limit, keyword, status } = body

    let data
    if (!!keyword) {
      data = yield User.searchWithCount(offset, limit, keyword, status)
    } else {
      data = yield User.listAllWithCount(offset, limit, status)
    }

    this.body = hashids.encodeJson(data)
  }],
  // POST /users
  create: [ RestAuth, function *(next) {
    const body = this.request.body

    if (!body.email) {
      const rule = {
        blocked: {
          type: 'array',
          itemType: 'string',
          rule: { type: 'string', allowEmpty: false }
        },
        type: { type: 'string' }
      }
      const errors = validate(rule, body)

      if (errors) {
        this.type = 'json'
        this.status = 200
        this.body = errors
        return
      }

      // updateAll
      try {
        each(body.blocked, function (hid) {
          co(function* () {
            const _body = {
              status: (body.type === 'blocked') ? 1 : 0
            }

            yield User.update(hid, _body)
          })
        })

        this.type = 'json'
        this.status = 201
        this.body = { done: true }
      } catch (err) {
        this.type = 'json'
        this.status = 200
        this.body = err
      }
    } else {
      const rule = {
        email: { type: 'email', required: true, allowEmpty: false },
        password: { type: 'password', required: true, allowEmpty: false }
      }
      const errors = validate(rule, body)

      if (errors) {
        this.type = 'json'
        this.status = 200
        this.body = errors
        return
      }

      // save
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
    }
  }],
  // GET /admins/:admin
  show: [ RestAuth, function *(next) {
    try {
      if (hashids.decode(this.params.admin) !== +this.user.id) {
        throw new Error('user check failed')
      }

      const user = yield User.load(this.params.admin)

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
    const body = this.request.body

    const rule = {
      name: { type: 'string', required: false, allowEmpty: true },
      password: { type: 'password', required: false, allowEmpty: false },
      status: { type: 'number', required: false, allowEmpty: true }
    }
    const errors = validate(rule, body)
    if (errors) {
      this.type = 'json'
      this.status = 200
      this.body = errors
      return
    }

    try {
      const user = yield User.update(this.params.admin, body)
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
  // TODO: dont delete self.
  destroy: [ RestAuth, function *(next) {
    try {
      const body = yield User.load(this.params.admin)
      if (hashids.decode(this.params.admin) !== body.id) {
        throw new Error('user check failed')
      }

      const user = yield User.delete(this.params.admin)
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
