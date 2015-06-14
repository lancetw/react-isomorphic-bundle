'use strict';

import React from 'react';

const isClient = (typeof (document) !== 'undefined') ? true : false;

const RequireAuth = (Component) => {
  class Authenticated extends React.Component {
    displayName = 'RequireAuth'

    constructor(props) {
      super(props);
    }

    render() {
      return <Component {...this.props} />;
    }
  }

  Authenticated.willTransitionTo = function (transition, params, query) {
    const flux = transition.context.flux;
    const nextPath = transition.path;
    const isAuthenticated = isClient ? (!!flux.getStore('auth').load()) : (!!transition.context.token);

    !isAuthenticated && transition.redirect('/login', {}, {'nextPath': nextPath});
  };

  Authenticated.contextTypes = {
    router: React.PropTypes.func.isRequired,
    flux: React.PropTypes.object.isRequired
  };

  return Authenticated;
};

export default RequireAuth;
