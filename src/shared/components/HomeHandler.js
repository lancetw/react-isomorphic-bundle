import React from 'react';
import connectToStores from 'flummox/connect';
import {Link} from 'react-router';

class HomeHandler extends React.Component {
  displayName: 'Home'

  render() {
    return (
      <div>
        <h1>Login</h1>
        <Link className="ui primary button" to="login">
          Login now
        </Link>
      </div>
    );
  }
}

export default HomeHandler;
