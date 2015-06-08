'use strict';

const passport = require('koa-passport');

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

module.exports = {
  passport: passport,
  facebook: require('./facebook')(passport)
};
