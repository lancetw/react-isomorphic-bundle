import Resource from 'koa-resource-router'
import validate from 'parameter'
import parse from 'co-body'
import hashids from 'src/shared/utils/hashids-plus'
import RestAuth from 'src/server/passport/auth/rest-auth'
import db from 'src/server/db'
import queryType from 'query-types'
import { each } from 'lodash'
import co from 'co'

const User = db.users

export default new Resource('users', {
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
  create: [ RestAuth, function *(next) {
    const body = this.request.body
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
      this.body = { errors: errors }
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
      this.status = 403
      this.body = err
    }
  }],
  update: [ RestAuth, function *(next) {
    const body = yield parse(this)

    const rule = {
      name: { type: 'string', required: false, allowEmpty: true },
      password: { type: 'password', compare: 'passwordCheck' },
      passwordCheck: 'password',
      status: { type: 'number', required: false }
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
  }]
})
