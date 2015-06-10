'use strict';

import passport from 'koa-passport';
import db from 'src/server/db';
import co from 'co';
import config from 'config';
import debug from 'debug';

const JwtStrategy = require('passport-jwt').Strategy;
const User = db.users;

let opts = {};
opts.secretOrKey = config.jwt.SECRET_OR_KEY;
opts.algorithm = config.jwt.OPTIONS.ALG;
opts.expiresInMinutes = config.jwt.OPTIONS.EXP;
opts.issuer = config.jwt.OPTIONS.ISS;
opts.audience = config.jwt.OPTIONS.AUD;

export default passport.use(new JwtStrategy(opts, function (payload, done) {
  co(function* () {
    try {
      debug('koa-passport')('jwt', payload.email, payload.password);
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




