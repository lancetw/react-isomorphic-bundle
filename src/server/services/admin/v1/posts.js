import Resource from 'koa-resource-router'
import validate from 'parameter'
import parse from 'co-body'
import hashids from 'src/shared/utils/hashids-plus'
import RestAuth from 'src/server/passport/auth/rest-auth'
import db from 'src/server/db'
import queryType from 'query-types'

const Post = db.posts

export default new Resource('posts', {
  index: [ RestAuth, function *(next) {
    const body = queryType.parseObject(this.request.query)
    const rule = {
      offset: { type: 'number', required: false },
      limit: { type: 'number', required: false },
      start: { type: 'number', required: false },
      end: { type: 'number', required: false },
      status: { type: 'number', required: false }
    }
    const errors = validate(rule, body)
    if (errors) {
      this.type = 'json'
      this.status = 200
      this.body = { errors: errors }
      return
    }

    const {  offset, limit, start, end, status } = body
    const data = !start
      ? yield Post.listAllWithCount(offset, limit, status)
      : yield Post.fetchWithCount(offset, limit, start, end, status)

    this.body = hashids.encodeJson(data)
  }],
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
      }
    }
    const errors = validate(rule, body)
    if (errors) {
      this.type = 'json'
      this.status = 200
      this.body = errors
      return
    }

    try {
      body.uid = hashids.decode(body.uid)

      if (body.uid !== +this.user.id) {
        throw new Error('user check failed')
      }

      body.startDate = moment(body.startDate).format('YYYY-MM-DD HH:mm:ss')
      body.endDate = moment(body.endDate).format('YYYY-MM-DD HH:mm:ss')

      if (typeof body.openDate === 'undefined') {
        body.openDate = body.startDate
      } else {
        body.openDate = moment(body.openDate).format('YYYY-MM-DD HH:mm:ss')
      }

      if (typeof body.closeDate === 'undefined') {
        body.closeDate = body.endDate
      } else {
        body.closeDate = moment(body.closeDate)
          .endOf('day').format('YYYY-MM-DD HH:mm:ss')
      }

      body.file = JSON.stringify(body.file)

      try {
        const userinfo = yield UsersInfo.load(+this.user.id)
        body.ocname = userinfo.ocname
        body.zipcode = userinfo.zipcode
        body.contact = userinfo.contact
        body.country = userinfo.country
        body.city = userinfo.city
        body.address = userinfo.address
      } catch (err) {/* no userinfo */}
      const post = yield Post.update(this.params.post, body)

      this.type = 'json'
      this.status = 201
      this.body = hashids.encodeJson(post)
    } catch (err) {
      this.type = 'json'
      this.status = 403
      this.body = err
    }
  }]
})
