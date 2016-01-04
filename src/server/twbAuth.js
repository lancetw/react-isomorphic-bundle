import request from 'superagent'
import conifg from 'config'
import db from 'src/server/db'
import co from 'co'
import { isEmpty } from 'lodash'

const User = db.users

export function twbAuth ({ email, password }) {
  return new Promise((resolve, reject) => {
    request
      .get('http://www.taiwanbible.com/web/api/login.jsp')
      .set('Accept', 'json')
      .query({'email': email})
      .query({'password': password})
      .query({'accessID': conifg.twb.ACCESS_ID})
      .end(function (err, res) {
        if (!err && res.body) {
          const user = res.body
          if (user.status === 1) {
            resolve({ email: user.email })
          } else if (user.status === -1 || isEmpty(conifg.twb.ACCESS_ID)) {
            reject('credentials were missing or incorrect')
          } else {
            reject('auth failed')
          }
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
