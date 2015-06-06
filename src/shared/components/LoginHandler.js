import React from 'react';
import {Link} from 'react-router';

class LoginHandler extends React.Component {
  displayName: 'Login'

  render() {
    return (
      <div>
        <h1>Login</h1>
        <Link className="ui primary button" to="/">
          測試2
        </Link>
      </div>
    );
  }
}

export default LoginHandler;
