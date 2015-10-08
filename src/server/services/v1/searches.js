import Resource from 'koa-resource-router'
import parse from 'co-body'
import db from 'src/server/db'
import hashids from 'src/shared/utils/hashids-plus'

const Post = db.posts
const Location = db.locations

export default new Resource('searches', {
  // GET /searches
  index: function *(next) {
    const { scope } = this.request.query

    if (scope === 'post') {
      const status = 0
      const { pattern, offset, limit } = this.request.query
      this.body = hashids.encodeJson(
        yield Post.search(pattern, status, offset, limit))
    }

    if (scope === 'nearby') {
      const { limit, lat, lng, dist } = this.request.query
      this.body = hashids.encodeJson(
        yield Location.nearBy(limit, dist, {lat, lng}))
    }
  }
})
