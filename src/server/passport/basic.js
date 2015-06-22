'use strict'

import passport from 'koa-passport'
import { BasicStrategy } from 'passport-http'
import conifg from 'config'
import db from 'src/server/db'
import co from 'co'
import debug from 'debug'

const User = db.users

export default passport.use(new BasicStrategy(
  function (email, password, done) {
  co(function *() {
    try {
      const user = yield User.auth(email, password)
      if (!user)
        throw 'no user'
      else
        return user
    }
    catch (err) {
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


