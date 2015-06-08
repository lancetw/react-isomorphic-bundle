'use strict';

import {isArray} from 'lodash';
import debug from 'debug';

const FacebookStrategy = require('passport-facebook').Strategy;
const FACEBOOK_CALLBACK_URL = '/auth/facebook/callback';

module.exports = function(passport){
  passport.use(new FacebookStrategy({
      clientID: require('config').passport.FACEBOOK_APP_ID,
      clientSecret: require('config').passport.FACEBOOK_APP_SECRET,
      callbackURL: FACEBOOK_CALLBACK_URL,
      enableProof: false
    },
    function(accessToken, refreshToken, profile, done){
      process.nextTick(function (){
        return done(null, profile);
      })
    }
  ));

};
