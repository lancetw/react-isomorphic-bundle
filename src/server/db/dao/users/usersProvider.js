const bcrypt = require('co-bcrypt')
const hashids = require('src/shared/utils/hashids-plus')
const models = require('src/server/db/models')

exports.create = function *(user) {
  const fillable = [ 'email', 'name', 'passwd', 'status' ]
  if (user.password) {
    const salt = yield bcrypt.genSalt(10)
    user.passwd = yield bcrypt.hash(user.password, salt)
  }
  user.status = 0

  return yield models.users.create(user, { fields: fillable })
}

exports.recreate = function *(unuser) {
  const fillable = [ 'name', 'passwd' ]
  const user = yield models.users.findOne({
    where: { email: unuser.email },
    paranoid: false
  })

  if (user) {
    if (user.password) {
      const salt = yield bcrypt.genSalt(10)
      user.passwd = yield bcrypt.hash(user.password, salt)
    }

    user.setDataValue('deletedAt', null)
    yield user.save({ paranoid: false })
  }

  return yield user.update(unuser, { fields: fillable })
}

exports.load = function *(hid) {
  const id = +hashids.decode(hid)
  return yield models.users.findOne({
    where: { id: id },
    raw: true
  })
}

exports.loadByEmail = function *(email) {
  return yield models.users.findOne({
    where: { email: email },
    raw: true
  })
}

exports.update = function *(hid, user) {
  const fillable = [ 'name', 'passwd', 'status' ]
  const id = +hashids.decode(hid)
  const salt = yield bcrypt.genSalt(10)
  if (!!user.password) {
    user.passwd = yield bcrypt.hash(user.password, salt)
  }
  const u = yield models.users.findOne({
    where: { id: id }
  })
  return yield u.update(user, { fields: fillable })
}

exports.delete = function *(hid) {
  const id = +hashids.decode(hid)
  const user = yield models.users.findOne({ where: { id: id } })
  return yield user.destroy()
}

exports.auth = function *(email, password) {
  const user = yield models.users.findOne({
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
  return yield models.users.findAndCountAll({
    offset: offset,
    limit: limit,
    order: [[ 'created_at', 'DESC' ], [ 'id', 'DESC' ]],
    attributes: ['id', 'email', 'created_at', 'status', 'name'],
    include: [{
      model: models.usersInfo,
      attributes: ['ocname', 'url'],
      required: false
    }],
    where: {
      status: +status
    },
    raw: true
  })
}

/* eslint-disable camelcase */
exports.searchWithCount = function *(offset=0, limit=20, pattern, status) {
  return yield models.users.findAndCountAll({
    offset: offset,
    limit: limit,
    order: [[ 'created_at', 'DESC' ], [ 'id', 'DESC' ]],
    attributes: ['id', 'email', 'created_at', 'status', 'name'],
    include: [{
      model: models.usersInfo,
      required: false
    }],
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

