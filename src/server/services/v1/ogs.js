import Resource from 'koa-resource-router'
import validate from 'parameter'
import queryType from 'query-types'
import hashids from 'src/shared/utils/hashids-plus'
import RestAuth from 'src/server/passport/auth/rest-auth'
import db from 'src/server/db'
import nunjucks from 'nunjucks'
import request from 'superagent'
import { isFinite, isEmpty } from 'lodash'

export function fetchOrgDataByCid (cid) {
  return new Promise((resolve, reject) => {
    request
      .get('http://church.oursweb.net/lite/mapsearch')
      .set('Accept', 'application/json')
      .query({'keyword': cid})
      .end(function (err, res) {
        if (!err && res.body) {
          if (res.body.geoinfo.length > 0) {
            resolve(res.body.geoinfo[0])
          } else {
            reject('nodata')
          }
        } else {
          reject(err)
        }
      })
  })
}

const Post = db.posts
const Location = db.locations

export default new Resource('ogs', {
  // GET /userinfo
  index: function *(next) {
    const { cid } = this.request.query
    this.body = hashids.encodeJson(
      yield fetchOrgDataByCid(cid))
  },
  // GET /userinfo/:user
  show: function *(next) {
    const cid = this.params.og
    const body = queryType.parseObject(this.request.query)
    const rule = {
      offset: { type: 'number', required: false },
      limit: { type: 'number', required: false },
      type: {
        type: 'enum',
        required: false,
        values: ['list', 'nearby']
      }
    }
    const errors = validate(rule, body)
    if (errors) {
      this.type = 'json'
      this.status = 200
      this.body = { errors: errors }
      return
    }

    const { type } = body
    let data = []
    if (!type || type === 'list') {
      const { offset, limit } = body
      data = yield Post.listWithOg(offset, limit, cid)
      if (data.length > 0) {
        const oginfo = { cid: cid, ocname: data[0].ocname }
        this.body = { oginfo: oginfo, data: hashids.encodeJson(data) }
      } else {
        const oginfo = { cid: cid }
        this.body = { oginfo: oginfo, data: [] }
      }
    } else if (type === 'nearby') {
      const { limit, dist } = body
      try {
        const oginfo = yield fetchOrgDataByCid(cid)
        oginfo.lat = parseFloat(oginfo.lat)
        oginfo.lng = parseFloat(oginfo.lng)
        const pattern = {
          lat: oginfo.lat,
          lng: oginfo.lng,
          dist: dist,
          cid: cid
        }
        data = yield Location.nearBy(limit, pattern)
        if (isEmpty(data)) {
          this.body = { oginfo: oginfo, data: [] }
        } else {
          this.body = { oginfo: oginfo, data: hashids.encodeJson(data) }
        }
      } catch (err) {
        this.type = 'json'
        this.status = 404
        this.body = err
      }
    }
  }
})
