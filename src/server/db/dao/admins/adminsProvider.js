const bcrypt = require('co-bcryptjs')
const hashids = require('src/shared/utils/hashids-plus')
const models = require('src/server/db/models')
import { isFinite } from 'lodash'

exports.create = function *(user) {
  const fillable = [ 'email', 'name', 'passwd', 'status', 'comment' ]
  if (user.password) {
    const salt = yield bcrypt.genSalt(10)
    user.passwd = yield bcrypt.hash(user.password, salt)
  }
  user.status = 0

  return yield models.admins.create(user, { fields: fillable })
}

exports.load = function *(hid) {
  const id = +hashids.decode(hid)
  if (!isFinite(id)) return false
  return yield models.admins.findOne({
    where: { id: id },
    raw: true
  })
}

exports.loadByEmail = function *(email) {
  return yield models.admins.findOne({
    where: { email: email },
    raw: true
  })
}

exports.update = function *(hid, user) {
  const fillable = [ 'name', 'passwd', 'status', 'comment' ]
  const id = +hashids.decode(hid)
  if (!isFinite(id)) return false
  if (user.password) {
    const salt = yield bcrypt.genSalt(10)
    user.passwd = yield bcrypt.hash(user.password, salt)
  }
  const u = yield models.admins.findOne({
    where: { id: id }
  })
  return yield u.update(user, { fields: fillable })
}

exports.destroy = function *(hid) {
  const id = +hashids.decode(hid)
  if (!isFinite(id)) return false
  const user = yield models.admins.findOne({ where: { id: id } })
  return yield user.destroy({ force: true })
}

exports.auth = function *(email, password) {
  const user = yield models.admins.findOne({
    where: { email: email, status: 0 },
    raw: true
  })

  if (!user) {
    return false
  }
  if (!user.passwd) {
    return false
  }
  if (email !== user.email) {
    return false
  }

  const pass = yield bcrypt.compare(password, user.passwd)
  if (pass) {
    return user
  } else {
    return null
  }
}

/* eslint-disable camelcase */
exports.listAllWithCount = function *(offset=0, limit=20, status=0) {
  return yield models.admins.findAndCountAll({
    offset: offset,
    limit: limit,
    order: [[ 'created_at', 'DESC' ], [ 'id', 'DESC' ]],
    attributes: ['id', 'email', 'created_at', 'status', 'name', 'comment'],
    where: {
      status: +status
    },
    raw: true
  })
}

/* eslin
/* eslint-disable camelcase */
exports.searchWithCount = function *(offset=0, limit=20, pattern, status) {
  return yield models.admins.findAndCountAll({
    offset: offset,
    limit: limit,
    order: [[ 'created_at', 'DESC' ], [ 'id', 'DESC' ]],
    attributes: ['id', 'email', 'created_at', 'status', 'name', 'comment'],
    where: {
      status: status,
      $or: [
        {
          email: {
            $like: '%' + pattern + '%'
          }
        }
      ]
    },
    raw: true
  })
}

exports.count = function *() {
  return yield models.admins.count()
}
