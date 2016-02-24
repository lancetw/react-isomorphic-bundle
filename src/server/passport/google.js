import passport from 'koa-passport'
import conifg from 'config'
import db from 'src/server/db'
import co from 'co'
import { isEmpty } from 'lodash'
import debug from 'debug'
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy

const User = db.users

const opts = {}
opts.clientID = conifg.passport.GOOGLE_APP_ID
opts.clientSecret = conifg.passport.GOOGLE_APP_SECRET
opts.callbackURL = conifg.passport.GOOGLE_CALLBACK

export default passport.use(new GoogleStrategy(
  opts,
  function (accessToken, refreshToken, profile, done) {
    co(function *() {
      let user

      try {
        if (isEmpty(profile.emails) || isEmpty(profile.emails[0].value)) {
          throw new Error('no emails')
        }
        debug('dev')('Google profile.emails', profile.emails[0].value)
        const email = profile.emails[0].value

        if (!isEmpty(profile.displayName)) {
          profile.name = profile.displayName
        }

        if (!isEmpty(email)) {
          profile.email = email
        }

        if (profile.email) {
          user = yield User.loadByEmail(email)
          if (user && user.status > 0) {
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
      return done(null, user)
    })
    .catch(function (err) {
      return done(err)
    })
  }
))
