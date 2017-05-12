import Resource from 'koa-resource-router'
import validate from 'parameter'
import hashids from 'src/shared/utils/hashids-plus'
import RestAuth from 'src/server/passport/auth/rest-auth'
import db from 'src/server/db'
import queryType from 'query-types'
import nunjucks from 'nunjucks'

const Statistic = db.statistics

export default new Resource('statistics', {
  // GET /statistics
  index: [ RestAuth, function *(next) {
    const body = queryType.parseObject(this.request.query)
    const rule = {
      year: { type: 'int', required: true, max: 2038, min: 1970 },
      month: { type: 'int', required: true, max: 12, min: 1 }
    }
    const errors = validate(rule, body)
    if (errors) {
      this.type = 'json'
      this.status = 200
      this.body = { errors: errors }
      return
    }

    const { year, month } = body
    const data = yield Statistic.listByYearMonth(year, month)
    this.body = hashids.encodeJson(data)
  }],
  // POST /statistics
  create: [ RestAuth, function *(next) {
  }],
  // GET /statistics/:statistic
  show: [ RestAuth, function *(next) {
  }],
  // GET /statistics/:statistics/edit
  edit: function *(next) {
    this.body = 'statistics'
  },
  // PUT /statistics/:statistic
  update: [ RestAuth, function *(next) {
  }],
  // DELETE /statistics/:statistic
  destroy: [ RestAuth, function *(next) {
  }]
})
