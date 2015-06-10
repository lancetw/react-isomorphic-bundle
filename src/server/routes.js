'use strict';

import jwt from 'jsonwebtoken';
import config from 'config';
import hashids from 'src/shared/utils/hashids-plus';
import debug from 'debug';

const router = require('koa-router')();
const passport = require('koa-passport');

router
  .post('/api/v1/login', function *(next) {
    let ctx = this;
    yield passport.authenticate('basic', {
      failureRedirect: '/login'
    }, function*(err, profile, info) {
      if (!err) {
        // response JSON web token

        let opts = {};
        opts.algorithm = config.jwt.OPTIONS.ALG;
        opts.expiresInMinutes = config.jwt.OPTIONS.EXP;
        opts.expiresInMinutes = config.jwt.OPTIONS.EXP;
        opts.issuer = config.jwt.OPTIONS.ISS;
        opts.audience = config.jwt.OPTIONS.AUD;

        let data = {};
        data.id = hashids.encode(profile.id);
        data.email = profile.email;
        data.password = profile.password;

        let token = jwt.sign(data, config.jwt.SECRET_OR_KEY, opts);
        ctx.body = {token: token};
      }
    });
  });


router
  .get('/api/v1/login', function *(next) {
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
