'use strict';

import passport from 'koa-passport';
import {LocalStrategy} from 'passport-local';
import db from 'src/server/db';
import co from 'co';

const User = db.users;

export default passport.use(new LocalStrategy(function (email, password, done) {
  co(function* () {
    try {
      const user = yield User.auth(email, password);
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



