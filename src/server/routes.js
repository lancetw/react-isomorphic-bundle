'use strict';

const router = require('koa-router')();
const passport = require('koa-passport');

router
  .get('/auth/local', function *(next) {
    let ctx = this;
    yield passport.authenticate('local', {
      failureRedirect: '/login'
    }, function*(err, profile, info) {
      if (!err) {
        ctx.redirect('/post');
      }
    });
  });

router
  .get('/auth/logout', function *(next) {
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
      failureRedirect: '/login',
    }, function*(err, profile, info) {
      if (!err) {
        ctx.redirect('/post');
      }
    });
  });

module.exports = router;
