import passport from 'koa-passport'
import FacebookStrategy from 'passport-facebook'
import conifg from 'config'
import db from 'src/server/db'
import co from 'co'
import { isEmpty } from 'lodash'
import debug from 'debug'

const User = db.users

const opts = {}
opts.clientID = conifg.passport.FACEBOOK_APP_ID
opts.clientSecret = conifg.passport.FACEBOOK_APP_SECRET
opts.callbackURL = conifg.passport.FACEBOOK_CALLBACK
opts.enableProof = false
opts.profileFields = ['id', 'displayName', 'email']

export default passport.use(new FacebookStrategy(
  opts,
  function (accessToken, refreshToken, profile, done) {
    co(function *() {
      let user

      try {
        if (isEmpty(profile.emails) || isEmpty(profile.emails[0].value)) {
          throw new Error('no emails')
        }
        debug('dev')('Facebook profile.emails', profile.emails[0].value)
        const email = profile.emails[0].value

        if (!isEmpty(email)) {
          profile.email = email
        }

        profile.name = profile.displayName
        debug('dev')('Facebook profile.displayName', profile.displayName)

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
