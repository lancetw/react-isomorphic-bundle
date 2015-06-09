'use strict';

import passport from 'koa-passport';
import {JwtStrategy} from 'passport-jwt';
import db from 'src/server/db';
import co from 'co';
import conifg from 'config';

const User = db.users;

const opts = {};
opts.secretOrKey = conifg.jwt.SECRET_OR_KEY;
opts.issuer = conifg.jwt.ISSUER;
opts.audience = conifg.jwt.AUDIENCE;

export default passport.use(new JwtStrategy(opts, function (payload, done) {
  co(function* () {
    try {
      const user = yield User.auth(payload.email, payload.password);
      if (!user) {
        return false;
      }
      else {
        return user;
      }
    }
    catch (err) {
      return err;
    }
  })
  .then(function (user) {
    return done(null, user);
  })
  .catch(function (err) {
    return done(err);
  });
}));




