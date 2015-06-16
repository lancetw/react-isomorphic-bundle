import React from 'react';
import {Link} from 'react-router/build/npm/lib';

class SyncTokenHandler extends React.Component {
  displayName: 'Sync Token'

  static willTransitionTo(transition, params, query, done) {
    if (typeof window !== 'undefined') {
      if (query.hasOwnProperty('token')) {
        transition.context.flux.getActions('auth').sync(query.token);
        transition.redirect('/');
      }
    }
    setTimeout(done, 0);
  }

  render() {
    const isClient = (typeof (document) !== 'undefined') ? true : false;
    if (isClient) {
      return (
        <main className="ui stackable page grid">
        </main>
      );
    }
    else {
      return (
        <main className="ui stackable page grid">
        </main>
      );
    }
  }
}

SyncTokenHandler.contextTypes = {
  flux: React.PropTypes.object.isRequired
};

export default SyncTokenHandler;
