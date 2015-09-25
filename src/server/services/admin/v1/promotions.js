import Resource from 'koa-resource-router'
import validate from 'parameter'
import parse from 'co-body'
import hashids from 'src/shared/utils/hashids-plus'
import RestAuth from 'src/server/passport/auth/rest-auth'
import db from 'src/server/db'
import queryType from 'query-types'
import nunjucks from 'nunjucks'

const Promotion = db.promotions

export default new Resource('promotions', {
  // GET /promotions
  index: function *(next) {
    const body = queryType.parseObject(this.request.query)
    const rule = {
      offset: { type: 'number', required: false },
      limit: { type: 'number', required: false }
    }
    const errors = validate(rule, body)
    if (errors) {
      this.type = 'json'
      this.status = 200
      this.body = { errors: errors }
      return
    }

    const {  offset, limit } = body

    const data = yield Promotion.listAllWithCount(offset, limit)
    this.body = hashids.encodeJson(data)
  },
  // POST /promotions
  create: [ RestAuth, function *(next) {
    const body = yield parse(this)
    const rule = {
      name: { type: 'string', required: true, allowEmpty: true },
      script: { type: 'string', required: true, allowEmpty: false },
      comment: { type: 'string', required: false, allowEmpty: true }
    }
    const errors = validate(rule, body)
    if (errors) {
      this.type = 'json'
      this.status = 200
      this.body = errors
      return
    }

    try {
      const promotion = yield Promotion.create(body)
      this.type = 'json'
      this.status = 201
      this.body = hashids.encodeJson(promotion)
    } catch (err) {
      this.type = 'json'
      this.status = 200
      this.body = err
    }
  }],
  // GET /promotions/:promotion
  show: [ RestAuth, function *(next) {
    try {
      const promotion = yield Promotion.load(this.params.promotion)

      this.type = 'json'
      this.status = 200
      this.body = hashids.encodeJson(promotion)
    } catch (err) {
      this.type = 'json'
      this.status = 404
      this.body = err
    }
  }],
  // GET /promotions/:promotion/edit
  edit: function *(next) {
    this.body = 'promotions'
  },
  // PUT /promotions/:promotion
  update: [ RestAuth, function *(next) {
    const body = yield parse(this)

    const rule = {
      name: { type: 'string', required: true, allowEmpty: true },
      script: { type: 'string', required: true, allowEmpty: false },
      comment: { type: 'string', required: false, allowEmpty: true }
    }
    const errors = validate(rule, body)
    if (errors) {
      this.type = 'json'
      this.status = 200
      this.body = errors
      return
    }

    try {
      const promotion = yield Promotion.update(this.params.promotion, body)
      this.type = 'json'
      this.status = 201
      this.body = hashids.encodeJson(promotion)
    } catch (err) {
      this.type = 'json'
      this.status = 404
      this.body = err
    }
  }],
  // DELETE /promotions/:promotion
  destroy: [ RestAuth, function *(next) {
    try {
      const promotion = yield Promotion.delete(this.params.promotion)
      this.type = 'json'
      this.status = 200
      this.body = hashids.encodeJson(promotion)
    } catch (err) {
      this.type = 'json'
      this.status = 404
      this.body = err
    }
  }]
})
