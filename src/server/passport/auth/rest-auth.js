'use strict';

import passport from 'koa-passport';
import debug from 'debug';

export default function *(next) {
  var ctx = this;
  yield* passport.authenticate('jwt', {session: false}, function *(err, user, info) {

    debug('koa-passport')('authenticate', err, info);

    if (err) {
      throw err;
    }
    if (user === false) {
      ctx.status = 401;
      ctx.body = {};
    }
    else {
      yield* next;
    }
  }).call(this, next);
}
