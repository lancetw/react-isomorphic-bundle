'use strict';

import passport from 'koa-passport';

export default function *(next) {
  var ctx = this;
  yield* passport.authenticate('basic', {session: false}, function *(err, user, info) {

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
};
