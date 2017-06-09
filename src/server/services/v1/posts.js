import Resource from 'koa-resource-router'
import validate from 'parameter'
import parse from 'co-body'
import hashids from 'src/shared/utils/hashids-plus'
import RestAuth from 'src/server/passport/auth/rest-auth'
import db from 'src/server/db'
import nunjucks from 'nunjucks'
import moment from 'moment'
import { isEmpty, isFinite, isNumber } from 'lodash'
import queryType from 'query-types'
import { fetchOrgDataByCid } from './ogs'
import { fetchOrgData } from './usersInfo'

const debug = require('debug')
const Post = db.posts
const UsersInfo = db.usersInfo
const Location = db.locations

/* eslint-disable max-len */
export default new Resource('posts', {
  // GET /posts
  index: function *(next) {
    const body = queryType.parseObject(this.request.query)
    const rule = {
      cprop: { type: 'number', required: false },
      offset: { type: 'number', required: false },
      limit: { type: 'number', required: false },
      start: { type: 'number', required: false },
      end: { type: 'number', required: false },
      user: { type: 'string', required: false },
      type: { type: 'number', required: false },
      nocontent: { type: 'bool', required: false }
    }
    const errors = validate(rule, body)
    if (errors) {
      this.type = 'json'
      this.status = 200
      this.body = { errors: errors }
      return
    }

    const { cprop, offset, limit, start, end, user, type, nocontent } = body
    let data = []
    if (!user) {
      if (!isFinite(+cprop)) {
        if (!type) {
          data = !start
          ? yield Post.list(offset, limit)
          : yield Post.fetch(offset, limit, start, end)
        } else {
          data = yield Post.listWithType(type, offset, limit)
        }
      } else {
        data = yield Post.listWithCprop(cprop, offset, limit, nocontent)
      }
    } else {
      const uid = hashids.decode(user)
      data = !start
        ? yield Post.listWithUser(offset, limit, uid)
        : yield Post.fetchWithUser(offset, limit, start, end, uid)
    }

    this.body = hashids.encodeJson(data)
  },
  // POST /posts
  create: [ RestAuth, function *(next) {
    const body = yield parse(this)
    const rule = {
      uid: { type: 'string' },
      type: { type: 'string' },
      prop: { type: 'string' },
      startDate: { type: 'int' },
      endDate: { type: 'int' },
      openDate: { type: 'int', required: false },
      closeDate: { type: 'int', required: false },
      dateType: { type: 'int', required: false },
      title: { type: 'string' },
      content: { type: 'string' },
      lat: { type: 'number', required: false },
      lng: { type: 'number', required: false },
      place: { type: 'string', required: false },
      file: {
        required: false,
        type: 'array',
        itemType: 'string',
        rule: { type: 'string', allowEmpty: true }
      },
      url: {
        required: false,
        type: 'url'
      },
      ocname: { type: 'string', required: false, allowEmpty: true }
    }
    const errors = validate(rule, body)
    if (errors) {
      this.type = 'json'
      this.status = 200
      this.body = { errors: errors }
      return
    }

    try {
      body.uid = hashids.decode(body.uid)

      if (body.uid !== +this.user.id) {
        throw new Error('user check failed')
      }

      body.startDate = moment(body.startDate).format()
      body.endDate = moment(body.endDate).format()
      if (!body.openDate) {
        body.openDate = body.startDate
      } else {
        body.openDate = moment(body.openDate).format()
      }
      if (!body.closeDate) {
        body.closeDate = body.endDate
      } else {
        body.closeDate = moment(body.closeDate).endOf('day').format()
      }

      body.file = JSON.stringify(body.file)

      let error
      if (body.ocname) {
        try {
          let org = {}
          if (isNumber(body.ocname)) {
            org = yield fetchOrgDataByCid(body.ocname)
          } else {
            org = yield fetchOrgData(body.ocname)
          }
          body.cid = org.oid
          body.ocname = org.ocname
          body.zipcode = org.zipcode
          body.contact = org.cname
          body.country = org.country
          body.city = org.city
          body.address = org.address
        } catch (err) {
          error = err
        }
      } else {
        try {
          const userinfo = yield UsersInfo.load(+this.user.id)
          body.cid = userinfo.cid
          body.ocname = userinfo.ocname
          body.zipcode = userinfo.zipcode
          body.contact = userinfo.contact
          body.country = userinfo.country
          body.city = userinfo.city
          body.address = userinfo.address
        } catch (err) {
          error = err
        }
      }

      const post = yield Post.create(body)

      if (post.id && body.lat && body.lng) {
        try {
          yield Location.create(post.id, {
            geometry: [body.lng , body.lat]
          })
        } catch (err) {debug('dev')('Database ERROR: create geometry, postgres ONLY')}
      }

      this.type = 'json'
      this.status = 201
      this.body = hashids.encodeJson(post)
    } catch (err) {
      this.type = 'json'
      this.status = 403
      this.body = err
    }
  }],
  // GET /posts/:post
  show: function *(next) {
    try {
      const post = yield Post.load(this.params.post)

      if (!isEmpty(post)) {
        this.type = 'json'
        this.status = 200
        this.body = hashids.encodeJson(post)
      } else {
        this.type = 'json'
        this.status = 404
      }
    } catch (err) {
      this.type = 'json'
      this.status = 403
    }
  },
  // GET /posts/:post/edit
  edit: function *(next) {
    this.body = 'post'
  },
  // PUT /posts/:post
  update: [ RestAuth, function *(next) {
    const body = yield parse(this)

    const rule = {
      uid: { type: 'string' },
      type: { type: 'string' },
      prop: { type: 'string' },
      startDate: { type: 'int' },
      endDate: { type: 'int' },
      openDate: { type: 'int', required: false },
      closeDate: { type: 'int', required: false },
      dateType: { type: 'int', required: false },
      title: { type: 'string' },
      content: { type: 'string' },
      lat: { type: 'number', required: false },
      lng: { type: 'number', required: false },
      place: { type: 'string', required: false },
      file: {
        required: false,
        type: 'array',
        itemType: 'string',
        rule: { type: 'string', allowEmpty: true }
      },
      url: {
        required: false,
        type: 'url'
      },
      ocname: { type: 'string', required: false, allowEmpty: true }
    }
    const errors = validate(rule, body)
    if (errors) {
      this.type = 'json'
      this.status = 200
      this.body = errors
      return
    }

    try {
      const saved = yield Post.load(this.params.post)
      if (!this.info.isAdmin) {
        if (saved.uid !== +this.user.id) {
          throw new Error('user check failed')
        }
      }
      body.uid = saved.uid

      body.startDate = moment(body.startDate).format()
      body.endDate = moment(body.endDate).format()

      if (typeof body.openDate === 'undefined') {
        body.openDate = body.startDate
      } else {
        body.openDate = moment(body.openDate).format()
      }

      if (typeof body.closeDate === 'undefined') {
        body.closeDate = body.endDate
      } else {
        body.closeDate = moment(body.closeDate)
          .endOf('day').format()
      }

      body.file = JSON.stringify(body.file)

      let error

      if (body.ocname) {
        try {
          let org = {}
          if (isNumber(body.ocname)) {
            org = yield fetchOrgDataByCid(body.ocname)
          } else {
            org = yield fetchOrgData(body.ocname)
          }
          body.cid = org.oid
          body.ocname = org.ocname
          body.zipcode = org.zipcode
          body.contact = org.cname
          body.country = org.country
          body.city = org.city
          body.address = org.address
        } catch (err) {
          error = err
        }
      } else {
        try {
          const userinfo = yield UsersInfo.load(body.uid)
          body.cid = userinfo.cid
          body.ocname = userinfo.ocname
          body.zipcode = userinfo.zipcode
          body.contact = userinfo.contact
          body.country = userinfo.country
          body.city = userinfo.city
          body.address = userinfo.address
        } catch (err) {
          error = err
        }
      }

      const post = yield Post.update(this.params.post, body)

      if (post.id && body.lat && body.lng) {
        try {
          yield Location.createOrUpdate(post.id, {
            geometry: [body.lng , body.lat]
          })
        } catch (err) {debug('dev')('Database ERROR: update geometry, postgres ONLY')}
      }

      this.type = 'json'
      this.status = 201
      this.body = hashids.encodeJson(post)
    } catch (err) {
      this.type = 'json'
      this.status = 403
      this.body = err
    }
  }],
  // DELETE /posts/:post
  destroy: [ RestAuth, function *(next) {
    try {
      const body = yield Post.load(this.params.post)
      if (body.uid !== +this.user.id) {
        throw new Error('user check failed')
      }

      const post = yield Post.destroy(this.params.post)

      if (post.id) {
        try {
          yield Location.destroy(post.id)
        } catch (err) {debug('dev')('Database ERROR: destroy geometry, postgres ONLY')}
      }

      this.type = 'json'
      this.status = 200
      this.body = hashids.encodeJson(post)
    } catch (err) {
      this.type = 'json'
      this.status = 200
      this.body = err
    }
  }]
})
