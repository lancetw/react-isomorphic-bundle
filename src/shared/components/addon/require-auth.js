'use strict';

import React from 'react';
import {isEmpty} from 'lodash';

const isClient = (typeof (document) !== 'undefined') ? true : false;

const RequireAuth = (Component) => {
  class Authenticated extends React.Component {
    displayName: 'RequireAuth'

    constructor(props) {
      super(props);
    }

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
    flux.getActions('auth').verify(token).then(function (isVerifed) {
      isNonAuthenticated = isClient ? !isVerifed : isTokenNonExist;
      isNonAuthenticated && transition.redirect('/login', {}, {'nextPath': nextPath});

      done();
    });
  };

  Authenticated.contextTypes = {
    router: React.PropTypes.func.isRequired,
    flux: React.PropTypes.object.isRequired
  };

  return Authenticated;
};

export default RequireAuth;
