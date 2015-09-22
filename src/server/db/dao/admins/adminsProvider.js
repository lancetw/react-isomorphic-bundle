const bcrypt = require('co-bcrypt')
const hashids = require('src/shared/utils/hashids-plus')
const models = require('src/server/db/models')

exports.init = function *(user) {
  // if no admin in the DB, create one.

}

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
  const fillable = [ 'name', 'passwd', 'comment' ]
  const id = +hashids.decode(hid)
  const salt = yield bcrypt.genSalt(10)
  user.passwd = yield bcrypt.hash(user.password, salt)
  const u = yield models.admins.findOne({
    where: { id: id }
  })
  return yield u.update(user, { fields: fillable })
}

exports.delete = function *(hid) {
  const id = +hashids.decode(hid)
  const user = yield models.admins.findOne({ where: { id: id } })
  return yield user.destroy()
}

exports.auth = function *(email, password) {
  const user = yield models.admins.findOne({
    where: { email: email },
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

