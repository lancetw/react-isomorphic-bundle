import React from 'react';
import {Link} from 'react-router';

class LoginHandler extends React.Component {
  displayName: 'Login'

  static async routerWillRun({ flux, state }) {
    const pagesActions = flux.getActions('page');
    return await pagesActions.setTitle('Please Login');
  }

  render() {
    return (
      <div>
        <h1>Login</h1>
        <Link className="ui primary button" to="/">
          Back to Home
        </Link>
      </div>
    );
  }
}

export default LoginHandler;
