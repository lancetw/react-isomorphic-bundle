import Resource from 'koa-resource-router'
import db from 'src/server/db'

const Post = db.posts

export default new Resource('cals', {
  // GET /cals
  index: function *(next) {
    const { action } = this.request.query

    if (action === 'countPostInMonth') {
      const { year, month } = this.request.query
      this.body = yield Post.countPerDayInMonth(year, month)
    }
  }
})
