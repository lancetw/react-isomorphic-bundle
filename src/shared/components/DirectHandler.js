import React from 'react';

class HomeHandler extends React.Component {
  displayName: 'Home'

  static willTransitionTo(transition, params, query, done) {
    if (typeof window !== 'undefined') {
      window.location = transition.path;
    }
    setTimeout(done, 0);
  }

  render() {
    const isClient = (typeof (document) !== 'undefined') ? true : false;
    if (isClient) {
      return (
        <main className="ui stackable page grid">
          <div className="column">

          </div>
        </main>
      );
    }
    else {
      return (
        <main className="ui stackable page grid">
          <div className="column">
            <div className="ui segment">
              <h1>Redirecting...</h1>
            </div>
          </div>
        </main>
      );
    }
  }
}

export default HomeHandler;
