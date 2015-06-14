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
    return (
      <main className="ui stackable page grid">
        <div className="column">
          <div className="ui segment">
            <h1><Link to="/">請按此繼續登入</Link></h1>
          </div>
        </div>
      </main>
    );
  }
}

SyncTokenHandler.contextTypes = {
  flux: React.PropTypes.object.isRequired
};

export default SyncTokenHandler;
