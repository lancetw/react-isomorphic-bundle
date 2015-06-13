'use strict';

import jwtHelper from './jwt-helper';
import passport from 'koa-passport';
import Flux from '../shared/flux';

const router = require('koa-router')();

router
  .post('/api/v1/login', function *(next) {
    let ctx = this;
    yield passport.authenticate('basic', {
      session: false,
    }, function*(err, profile, info) {
      if (!err && profile) {
        // response JSON web token
        const token = jwtHelper(profile);

        const flux = new Flux();
        flux.getActions('auth').setToken(token);

        ctx.body = {token: token};
      }
      else {
        ctx.status = 200;
        ctx.body = {profile};
      }
    });
  });


router
  .get('/api/v1/logout', function *(next) {
    this.logout();
    this.redirect('/');
  });

router
  .get('/auth/facebook', function *(next) {
    yield passport.authenticate('facebook', {scope: ['email']});
  });

router
  .get('/auth/facebook/request/email', function *(next) {
    yield passport.authenticate('facebook', {authType: 'rerequest', scope: ['email']});
  });

router
  .get('/auth/facebook/callback', function *(next) {
    let ctx = this;
    yield passport.authenticate('facebook', {
      failureRedirect: '/login',
    }, function*(err, profile, info) {
      if (!err) {
        const token = jwtHelper(profile);
        ctx.redirect('/customs?token=' + token);
      }
      else {
        // need email
        ctx.redirect('/auth/facebook/request/email');
      }
    });
  });

module.exports = router;
