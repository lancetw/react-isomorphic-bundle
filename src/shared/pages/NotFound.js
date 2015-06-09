'use strict';

import React from 'react';
import {Link} from 'react-router';

class NotFound extends React.Component {
  displayName: 'NotFound'

  render() {
    return (
      <main className="ui stackable page grid">
        <div className="column">
          <div className="ui segment">
            <h1>HTTP 404</h1>
            <Link className="ui primary button" to="/">
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    );
  }
}

export default NotFound;
