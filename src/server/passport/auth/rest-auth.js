'use strict'

import passport from 'koa-passport'
import debug from 'debug'

export default function *(next) {
  let ctx = this
  yield* passport.authenticate(
    'jwt',
    { session: false },
    function *(err, user, info) {
    if (err || !user) {
      ctx.status = 401
      ctx.body = {}
    } else
      yield* next
  }).call(this, next)
}
