import React from 'react';

class HomeHandler extends React.Component {
  displayName: 'Home'

  static willTransitionTo(transition, params, query, callback) {
    if (typeof window !== 'undefined') {
      window.location = transition.path;
    }
    setTimeout(callback, 0);
  }

  render() {
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

export default HomeHandler;
