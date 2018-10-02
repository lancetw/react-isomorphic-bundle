import Resource from 'koa-resource-router'
import db from 'src/server/db'
import hashids from 'src/shared/utils/hashids-plus'
import request from 'superagent'

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
      const { limit, pattern } = this.request.query
      let q = {}
      try {
        q = JSON.parse(pattern)
      } catch (err) {/* error */}

      this.body = hashids.encodeJson(
        yield Location.nearBy(limit, q))
    }

    if (scope === 'geocode') {
      const { address } = this.request.query
      const googleApiKey = 'AIzaSyAOL2_DNy1xwxo2t1Lxif4r2gnBpDjOkn4'
    
      this.body = yield new Promise((resolve, reject) => {
        request
        .get('https://maps.googleapis.com/maps/api/geocode/json')
        .set('Accept', 'application/json')
        .query({ key: googleApiKey })
        .query({ address: address })
        .end(function (err, res) {
          if (!err && res.body) {
            resolve(res.body)
          } else {
            reject(err)
          }
        })
      })
    }
  }
})
