import passport from 'koa-passport'
import db from 'src/server/db'

const config = require('config').admin
const Admin = db.admins

export default function *(next) {
  const ctx = this
  yield* passport.authenticate(
    'jwt',
    { session: false },
    function *(err, user, info) {
      const count = yield Admin.count()
      if (count === 0) {
        ctx.user = {
          id: 0,
          email: config.defaultEmail
        }
        yield next
      } else {
        if (err || !user) {
          ctx.status = 401
          ctx.body = {}
        } else {
          ctx.user = user
          ctx.info = info
          yield next
        }
      }
    }).call(this, next)
}
