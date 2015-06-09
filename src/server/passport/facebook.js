'use strict';

import passport from 'koa-passport';
import FacebookStrategy from 'passport-facebook';
import conifg from 'config';

const opts = {};
opts.clientID = conifg.passport.FACEBOOK_APP_ID;
opts.clientSecret = conifg.passport.FACEBOOK_APP_SECRET;
opts.callbackURL = conifg.passport.FACEBOOK_CALLBACK;
opts.enableProof = false;

export default passport.use(new FacebookStrategy(opts, function (accessToken, refreshToken, profile, done) {
  process.nextTick(function () {
    return done(null, profile);
  });
}));



