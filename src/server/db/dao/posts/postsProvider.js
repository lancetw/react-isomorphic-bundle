'use strict'

const models = require('src/server/db/models')
const hashids = require('src/shared/utils/hashids-plus')
const Post = models.posts
const moment = require('moment')

exports.create = function *(post) {
  const fillable = [
    'uid',
    'type',
    'prop',
    'startDate',
    'endDate',
    'openDate',
    'closeDate',
    'title',
    'content'
  ]

  return yield Post.create(post, { fields: fillable })
}

exports.load = function *(hid) {
  const id = +hashids.decode(hid)
  return yield Post.findOne({
    where: { id: id }
  })
}

/* eslint-disable camelcase */
exports.list = function *(offset, limit) {
  const _offset = offset || 0
  const _limit = limit || 20

  return yield Post.findAll({
    offset: _offset,
    limit: _limit,
    order: [[ 'start_date', 'ASC' ]],
    where: {
      close_date: {
        $gte: moment().startOf('day').subtract('1', 'days').format()
      }
    }
  })
}

exports.update = function *(hid, post) {
  const fillable = [
    'type',
    'prop',
    'start_date',
    'end_date',
    'open_date',
    'close_date',
    'title',
    'content'
  ]
  const id = +hashids.decode(hid)
  let p = yield Post.findOne({
    where: { id: id }
  })
  return yield p.update(post, { fields: fillable })
}

exports.delete = function *(hid) {
  const id = +hashids.decode(hid)
  let post = yield Post.findOne({ where: { id: id } })
  return yield post.destroy()
}

exports.updateGeo = function *(hid, geo) {
  const fillable = [
    'lat',
    'lng',
    'country',
    'city',
    'place',
    'zipcode',
    'address'
  ]
  const id = +hashids.decode(hid)
  let p = yield Post.findOne({
    where: { id: id }
  })
  return yield p.update(geo, { fields: fillable })
}

exports.updateAttachments = function *(hid, attach) {
  const fillable = [ 'url', 'img', 'file' ]
  const id = +hashids.decode(hid)
  let p = yield Post.findOne({
    where: { id: id }
  })
  return yield p.update(attach, { fields: fillable })
}
