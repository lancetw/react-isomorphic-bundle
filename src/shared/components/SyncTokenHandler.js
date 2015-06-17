import React from 'react';
import {Link} from 'react-router/build/npm/lib';

class SyncTokenHandler extends React.Component {
  displayName: 'Sync Token'

  static willTransitionTo(transition, params, query) {
    if (query.hasOwnProperty('token')) {
      if (typeof window !== 'undefined') {
        transition.context.flux.getActions('auth').sync(query.token);
        transition.redirect('/');
      }
    }
  }

  render() {
    const isClient = (typeof (document) !== 'undefined') ? true : false;
    if (isClient) {
      return (
        <main className="ui stackable page grid">
        Loading...
        </main>
      );
    }
    else {
      return (
        <main className="ui stackable page grid">
        <Link to="/">Click here to continue...</Link>
        </main>
      );
    }
  }
}

SyncTokenHandler.contextTypes = {
  flux: React.PropTypes.object.isRequired
};

export default SyncTokenHandler;
