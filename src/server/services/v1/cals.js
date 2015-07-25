'use strict'

import Resource from 'koa-resource-router'
import parse from 'co-body'
import db from 'src/server/db'

const Post = db.posts

export default new Resource('cals', {
  // GET /cals
  index: function *(next) {
    const { start, end } = this.request.query
    this.body = yield Post.count(start, end)
  }
})
