import request from 'superagent'
import conifg from 'config'
import db from 'src/server/db'
import co from 'co'
import { isEmpty } from 'lodash'

const User = db.users
const parseString = require('xml2js').parseString

export function twbAuth ({ id, password }) {
  return new Promise((resolve, reject) => {
    request
      .get('http://taiwanbible.com/loginapi.jsp')
      .set('Accept', 'xml')
      .query({'username': id})
      .query({'password': password})
      .query({'accessID': conifg.twb.ACCESS_ID})
      .end(function (err, res) {
        if (!err && res.text) {
          parseString(res.text, function (xmlerr, xmlres) {
            if (!xmlerr) {
              const email = xmlres.TAIWANBIBLE.EMAIL[0]
              if (email && email !== 'null') {
                resolve({ email })
              } else {
                reject('auth failed')
              }
            } else {
              reject(xmlerr)
            }
          })
        } else {
          reject(err)
        }
      })
  })
}

export function twbBindUser ({ email }) {
  return new Promise((resolve, reject) => {
    co(function *() {
      let user

      try {
        if (!isEmpty(email) && email !== 'null') {
          user = yield User.loadByEmail(email)
          if (user.status > 0) {
            throw new Error('user blocked')
          }

          if (!user) {
            try {
              user = yield User.create(profile)
            } catch (err) {
              if (err.name === 'SequelizeUniqueConstraintError') {
                return yield User.recreate(profile)
              } else {
                throw err
              }
            }
          }
        }

        if (!user) {
          throw new Error('no user')
        } else {
          return user
        }
      } catch (err) {
        throw err
      }
    })
    .then(function (user) {
      resolve(user)
    })
    .catch(function (err) {
      reject(err)
    })
  })
}


