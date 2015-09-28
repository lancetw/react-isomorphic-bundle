import passport from 'koa-passport'
import db from 'src/server/db'
import co from 'co'
import debug from 'debug'

const config = require('config').admin
const LocalStrategy = require('passport-local').Strategy
const Admin = db.admins

export default passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'passwd',
  session: false
}, function (email, passwd, done) {
  co(function *() {
    try {
      // if db is empty and default email and password
      const count = yield Admin.count()
      if (count === 0
          && email === config.defaultEmail
          && passwd === config.defaultPassword) {
        return {
          id: 0,
          email: config.defaultEmail
        }
      }

      const user = yield Admin.auth(email, passwd)
      if (!user) {
        throw new Error('no permissions')
      } else {
        return user
      }
    } catch (err) {
      throw err
    }
  })
  .then(function (user) {
    return done(null, user)
  })
  .catch(function (err) {
    return done(err)
  })
}))


