'use strict'

import Resource from 'koa-resource-router'
import validate from 'parameter'
import parse from 'co-body'
import hashids from 'src/shared/utils/hashids-plus'
import RestAuth from 'src/server/passport/auth/rest-auth'
import db from 'src/server/db'
import nunjucks from 'nunjucks'
import moment from 'moment'
import { isEmpty } from 'lodash'

const Post = db.posts

/* eslint-disable max-len */
export default new Resource('posts', {
  // GET /posts
  index: function *(next) {
    const { cprop, offset, limit, start, end, user } = this.request.query
    let data
    if (user) {
      const uid = hashids.decode(user)
      data = typeof start !== null
      ? yield Post.fetchWithUser(offset, limit, start, end, uid)
      : yield Post.listWithUser(offset, limit, uid)
    } else {
      if (cprop)
        data = yield Post.listWithCprop(cprop, offset, limit)
      else
        data = typeof start !== null
        ? yield Post.fetch(offset, limit, start, end)
        : yield Post.list(offset, limit)
    }

    this.body = hashids.encodeJson(data)
  },
  // POST /posts
  create: [ RestAuth, function *(next) {
    let body = yield parse(this)
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
      this.body = { errors: errors }
      return
    }

    try {
      body.uid = hashids.decode(body.uid)

      if (body.uid !== this.user.id)
        throw new Error('user check failed')

      body.startDate = moment(body.startDate).format()
      body.endDate = moment(body.endDate).format()
      if (typeof body.openDate === 'undefined')
        body.openDate = body.startDate
      else
        body.openDate = moment(body.openDate).format()
      if (typeof body.closeDate === 'undefined')
        body.closeDate = body.endDate
      else
        body.closeDate = moment(body.closeDate).endOf('day').format()

      body.file = JSON.stringify(body.file)

      const post = yield Post.create(body)
      this.type = 'json'
      this.status = 201
      this.body = hashids.encodeJson(post)
    } catch (err) {
      this.type = 'josn'
      this.status = 200
      this.body = err
    }

  }],
  // GET /posts/:post
  show: function *(next) {
    try {
      const post = yield Post.load(this.params.post)
      this.type = 'json'
      this.status = 200
      this.body = hashids.encodeJson(post)
    } catch (err) {
      this.type = 'josn'
      this.status = 404
    }
  },
  // GET /posts/:post/edit
  edit: function *(next) {
    this.body = 'post'
  },
  // PUT /posts/:post
  update: [ RestAuth, function *(next) {
    let body = yield parse(this)

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

      if (body.uid !== this.user.id)
        throw new Error('user check failed')

      body.startDate = moment(body.startDate).format()
      body.endDate = moment(body.endDate).format()
      if (typeof body.openDate === 'undefined')
        body.openDate = body.startDate
      else
        body.openDate = moment(body.openDate).format()
      if (typeof body.closeDate === 'undefined')
        body.closeDate = body.endDate
      else
        body.closeDate = moment(body.closeDate).endOf('day').format()
      body.file = JSON.stringify(body.file)

      const post = yield Post.update(this.params.post, body)
      this.type = 'json'
      this.status = 201
      this.body = hashids.encodeJson(post)
    } catch (err) {
      this.type = 'josn'
      this.status = 200
      this.body = err
    }
  }],
  // DELETE /posts/:post
  destroy: [ RestAuth, function *(next) {
    try {
      const body = yield Post.load(this.params.post)
      if (body.uid !== this.user.id)
        throw new Error('user check failed')

      const post = yield Post.destroy(this.params.post)
      this.type = 'json'
      this.status = 200
      this.body = hashids.encodeJson(post)
    } catch (err) {
      this.type = 'josn'
      this.status = 200
      this.body = err
    }
  }]
})
