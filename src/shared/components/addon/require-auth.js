'use strict';

import React from 'react';
import BaseComponent from 'shared/components/BaseComponent';
import {isEmpty} from 'lodash';

const isClient = (typeof (document) !== 'undefined') ? true : false;

const RequireAuth = (Component) => {
  class Authenticated extends BaseComponent{
    displayName: 'RequireAuth'

    render() {
      return <Component {...this.props} />;
    }
  }

  Authenticated.willTransitionTo = function (transition, params, query, done) {
    const flux = transition.context.flux;
    const nextPath = transition.path;
    const token = isClient ? flux.getStore('auth').load() : transition.context.token;

    let isTokenNonExist = isEmpty(token) ? true : false;
    let isNonAuthenticated = true;
    isClient && flux.getActions('auth').verify(token).then(function (isVerifed) {
      isNonAuthenticated = isClient ? !isVerifed : isTokenNonExist;
      isNonAuthenticated && transition.redirect('/logout');

      done();
    }, function (err) {
      transition.redirect('/login');
      done();
    });

    if (!isClient) {
      if (isTokenNonExist) {
        transition.redirect('/login');
        done();
      }

      done();
    }
  };

  Authenticated.contextTypes = {
    router: React.PropTypes.func.isRequired
  };

  return Authenticated;
};

export default RequireAuth;
