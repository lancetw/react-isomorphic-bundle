const bcrypt = require('co-bcrypt')
const hashids = require('src/shared/utils/hashids-plus')
const models = require('src/server/db/models')

exports.createOrUpdate = function *(hid, info) {
  const fillable = [
    'uid',
    'cid',
    'ocname',
    'contact',
    'country',
    'city',
    'address',
    'place',
    'zipcode',
    'lat',
    'lng',
    'tel',
    'fax',
    'url',
    'email'
  ]
  const id = +hashids.decode(hid)
  const userInfo = yield models.usersInfo.findOne({
    where: { uid: id },
    paranoid: false
  })

  if (!userInfo) {
    info.uid = id
    return yield models.usersInfo.create(info, { fields: fillable })
  } else {
    return yield userInfo.update(info, { fields: fillable })
  }
}

exports.load = function *(hid) {
  const id = +hashids.decode(hid)
  return yield models.usersInfo.findOne({
    where: { uid: id }
  })
}
