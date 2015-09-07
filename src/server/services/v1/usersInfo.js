import Resource from 'koa-resource-router'
import validate from 'parameter'
import parse from 'co-body'
import hashids from 'src/shared/utils/hashids-plus'
import RestAuth from 'src/server/passport/auth/rest-auth'
import db from 'src/server/db'
import nunjucks from 'nunjucks'
import request from 'superagent'

const UserInfo = db.usersInfo

function fetchOrgData (ocname) {
  return new Promise((resolve, reject) => {
    request
      .get('http://church.oursweb.net/lite/mapsearch')
      .set('Accept', 'application/json')
      .query({'keyword': ocname})
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

export default new Resource('usersinfo', {
  // GET /userinfo
  index: function *(next) {
    this.body = nunjucks.render('users/index.html')
  },
  // GET /userinfo/:user
  show: [ RestAuth, function *(next) {
    try {
      if (hashids.decode(this.params.usersinfo) !== this.user.id) {
        throw new Error('user check failed')
      }

      const userInfo = yield UserInfo.load(this.params.usersinfo)

      this.type = 'json'
      this.status = 200
      this.body = hashids.encodeJson(userInfo)
    } catch (err) {
      this.type = 'json'
      this.status = 404
      this.body = err
    }
  }],
  // PUT /userinfo/:user
  update: [ RestAuth, function *(next) {
    const body = yield parse(this)

    const rule = {
      ocname: { type: 'string', required: true },
      contact: { type: 'string', required: false, allowEmpty: true },
      country: { type: 'string', required: false, allowEmpty: true },
      city: { type: 'string', required: false, allowEmpty: true },
      address: { type: 'string', required: false, allowEmpty: true },
      zipcode: { type: 'string', required: false, allowEmpty: true },
      place: { type: 'string', required: false, allowEmpty: true },
      lat: { type: 'number', required: false },
      lng: { type: 'number', required: false },
      tel: { type: 'string', required: false, allowEmpty: true },
      fax: { type: 'string', required: false, allowEmpty: true },
      url: { type: 'string', required: false, allowEmpty: true },
      email: { type: 'string', required: false }
    }
    const errors = validate(rule, body)
    if (errors) {
      this.type = 'json'
      this.status = 200
      this.body = errors
      return
    }

    try {
      if (hashids.decode(this.params.usersinfo) !== this.user.id) {
        throw new Error('user check failed')
      }
      // fetch cid by ocname
      try {
        const org = yield fetchOrgData(body.ocname)
        body.cid = org.oid
        if (typeof body.lat === 'undefined' || !body.lat) body.lat = org.lat
        if (typeof body.lng === 'undefined' || !body.lng) body.lng = org.lng
      } catch (err) {
        body.cid = null
        if (typeof body.lat === 'undefined' || !body.lat) body.lat = null
        if (typeof body.lng === 'undefined' || !body.lng) body.lng = null
      }

      const userInfo
        = yield UserInfo.createOrUpdate(this.params.usersinfo, body)
      this.type = 'json'
      this.status = 201
      this.body = hashids.encodeJson(userInfo)
    } catch (err) {
      this.type = 'json'
      this.status = 404
      this.body = err
    }
  }]
})
