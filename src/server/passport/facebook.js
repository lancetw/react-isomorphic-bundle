'use strict';

import passport from 'koa-passport';
import FacebookStrategy from 'passport-facebook';
import conifg from 'config';
import db from 'src/server/db';
import co from 'co';
import {isEmpty} from 'lodash';
import debug from 'debug';

const User = db.users;

const opts = {};
opts.clientID = conifg.passport.FACEBOOK_APP_ID;
opts.clientSecret = conifg.passport.FACEBOOK_APP_SECRET;
opts.callbackURL = conifg.passport.FACEBOOK_CALLBACK;
opts.enableProof = false;

export default passport.use(new FacebookStrategy(opts, function (accessToken, refreshToken, profile, done) {
  co(function *() {
    try {
      if (!profile.emails) {
        throw new Error('no emails');
      }

      let data = {};
      data.email = profile.emails[0].value;

      let user = yield User.loadByEmail(data.email);

      if (!user) {
        user = yield User.create(data);
      }

      if (!user) {
        throw new Error('no user');
      }
      else {
        return user;
      }
    }
    catch (err) {
      throw err;
    }
  })
  .then(function (user) {
    return done(null, user);
  })
  .catch(function (err) {
    return done(err);
  });

}));



