const bcrypt = require('co-bcrypt')
const hashids = require('src/shared/utils/hashids-plus')
const models = require('src/server/db/models')

exports.create = function *(promotion) {
  const fillable = [ 'script', 'name', 'status', 'comment' ]

  return yield models.promotions.create(promotion, { fields: fillable })
}

exports.load = function *(hid) {
  const id = +hashids.decode(hid)
  return yield models.admins.findOne({
    where: { id: id },
    raw: true
  })
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
