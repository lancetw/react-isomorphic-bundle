import passport from 'koa-passport'

export default function *(next) {
  const ctx = this
  yield* passport.authenticate(
    'jwt',
    { session: false },
    function *(err, user, info) {
      if (err || !user) {
        ctx.status = 401
        ctx.body = {}
      } else {
        ctx.user = user
        ctx.info = info
        yield next
      }
    }).call(this, next)
}
