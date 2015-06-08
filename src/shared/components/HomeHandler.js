import React from 'react';
import connectToStores from 'flummox/connect';
import {Link} from 'react-router';

class HomeHandler extends React.Component {
  displayName: 'Home'

  static async routerWillRun({ flux, state }) {
    const pagesActions = flux.getActions('page');
    return await pagesActions.setTitle('Homepage');
  }

  render() {
    return (
      <main className="ui stackable page grid">
        <div className="column">
          <div className="ui segment">
            <h1>Hello World!</h1>
            <Link className="ui primary button" to="login">
              Log in now
            </Link>
          </div>
        </div>
      </main>
    );
  }
}

export default HomeHandler;
