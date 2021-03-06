import passport from 'koa-passport'
import db from 'src/server/db'
import co from 'co'
import config from 'config'
import debug from 'debug'

const JwtStrategy = require('passport-jwt').Strategy
const User = db.users
const Admin = db.admins

const opts = {}
opts.secretOrKey = config.jwt.SECRET_OR_KEY
opts.algorithm = config.jwt.OPTIONS.ALG
opts.expiresIn = config.jwt.OPTIONS.EXP
opts.issuer = config.jwt.OPTIONS.ISS
opts.audience = config.jwt.OPTIONS.AUD

export default passport.use(new JwtStrategy(opts, function (payload, done) {
  co(function* () {
    try {
      let user
      if (!!payload.isAdmin) {
        user = yield Admin.loadByEmail(payload.email)
      } else {
        user = yield User.loadByEmail(payload.email)
      }

      if (!user) {
        throw new Error('no user')
      } else {
        return user
      }
    } catch (err) {
      throw new Error(err)
    }
  })
  .then(function (user) {
    return done(null, user, payload)
  })
  .catch(function (err) {
    return done(err, null, payload)
  })
}))
