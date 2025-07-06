const bcrypt = require('co-bcryptjs')
const hashids = require('src/shared/utils/hashids-plus')
const models = require('src/server/db/models')
const { Op } = require('sequelize')
import { isFinite } from 'lodash'

exports.create = function *(promotion) {
  const fillable = [ 'script', 'name', 'status', 'comment' ]

  return yield models.promotions.create(promotion, { fields: fillable })
}

exports.load = function *(hid) {
  const id = +hashids.decode(hid)
  if (!isFinite(id)) return {}
  return yield models.promotions.findOne({
    where: { id: id },
    raw: true
  })
}

exports.delete = function *(hid) {
  const id = +hashids.decode(hid)
  if (!isFinite(id)) return false
  const ad = yield models.promotions.findOne({ where: { id: id } })
  return yield ad.destroy()
}

/* eslint-disable camelcase */
exports.listAllWithCount = function *(offset=0, limit=20) {
  return yield models.promotions.findAndCountAll({
    offset: offset,
    limit: limit,
    order: [[ 'created_at', 'DESC' ], [ 'id', 'DESC' ]],
    attributes: ['id', 'name', 'script', 'status'],
    raw: true
  })
}

exports.fetchPair = function* (num = 1) {
  return yield models.promotions.findAll({
    where: {
      name: {
        [Op.like]: `${num}%`
      }
    },
    attributes: ['name', 'script', 'status'],
    limit: 2,
    raw: true
  });
}
