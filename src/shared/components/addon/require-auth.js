'use strict';

import React from 'react';

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
    let isAuthenticated = flux.getStore('auth').isAuthenticated();
    const nextPath = transition.path;
    if (!isAuthenticated) {
      transition.redirect('/login', {}, {'nextPath': nextPath});
    }
  };

  Authenticated.contextTypes = {
    router: React.PropTypes.func.isRequired,
    flux: React.PropTypes.object.isRequired
  };

  return Authenticated;
};

export default RequireAuth;
