'use strict';

const router = require('koa-router')();
const passport = require('./passport').passport;

router
  .get('/logout', function *(next) {
    this.cookies.set('passport', null);
    this.logout();
    this.redirect('/');
  });

router
  .get('/auth/facebook', function *(next) {
    yield passport.authenticate('facebook');
  });

router
  .get('/auth/facebook/callback', function *(next) {
    let ctx = this;
    yield passport.authenticate('facebook', {
      failureRedirect: '/',
      scope: ['email']
    }, function*(err, profile, info) {
      if (!err) {
        ctx.redirect('/post');
      }
    });
  });

module.exports = router;
