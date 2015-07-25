'use strict'

const Sequelize = require('sequelize')
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
    'content',
    'file',
    'lat',
    'lng',
    'place'
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
exports.list = function *(offset=0, limit=20) {
  return yield Post.findAll({
    offset: offset,
    limit: limit,
    order: [[ 'start_date', 'ASC' ]],
    where: {
      end_date: {
        $gte: moment().startOf('day').utc().format()
      }
    }
  })
}

/* eslint-disable camelcase */
exports.fetch = function *(offset=0, limit=20, start, end) {
  let _start = start
  let _end = end

  if (typeof _start === 'undefined')
    _start = moment().startOf('day').valueOf()
  else
    _start = +_start
  if (typeof _end === 'undefined')
    _end = moment(+_start).endOf('day').valueOf()
  else
    _end = +_end


  return yield Post.findAll({
    offset: offset,
    limit: limit,
    order: [[ 'start_date', 'ASC' ]],
    where: {
      end_date: {
        $gte: moment(_start).utc().subtract('1', 'days').startOf('day').format()
      }
    }
  })
}

/* eslint-disable camelcase */
exports.count = function *(start, end) {
  let _start = +start
  let _end = +end

  console.log(moment(_start).startOf('day').utc().format('MM-DD-YYYY'))
  console.log(moment(_end).endOf('day').utc().format('MM-DD-YYYY'))

  return yield Post.findAll({
    order: [[ 'start_date', 'ASC' ]],
    where: {
      start_date: {
        $gte: moment(_start).startOf('day').utc().format()
      },
      start_date: {
        $lte: moment(_end).endOf('day').utc().format()
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
