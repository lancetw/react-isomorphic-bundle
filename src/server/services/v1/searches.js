import Resource from 'koa-resource-router'
import parse from 'co-body'
import db from 'src/server/db'
import hashids from 'src/shared/utils/hashids-plus'

const Post = db.posts

export default new Resource('searches', {
  // GET /searches
  index: function *(next) {
    const { scope, pattern } = this.request.query

    if (scope === 'post') {
      const status = 0
      const { offset, limit } = this.request.query
      this.body = hashids.encodeJson(
        yield Post.search(pattern, status, offset, limit))
    }
  }
})
