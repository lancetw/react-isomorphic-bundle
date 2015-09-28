import Resource from 'koa-resource-router'
import db from 'src/server/db'

const Promotion = db.promotions

export default new Resource('promotions', {
  // GET /cpromotions
  index: function *(next) {
    this.body = yield Promotion.fetchPair()
  }
})
