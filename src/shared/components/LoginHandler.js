import React from 'react';
import {Link} from 'react-router';

class LoginHandler extends React.Component {
  displayName: 'Log in'

  static async routerWillRun({ flux, state }) {
    const pagesActions = flux.getActions('page');
    return await pagesActions.setTitle('Please Log in');
  }

  render() {
    return (
      <main className="ui stackable page grid">
        <div className="column">
          <div className="ui two column middle aligned relaxed fitted stackable grid">
            <div className="column">
              <div className="ui form segment">
                <div className="field">
                  <label>Email</label>
                  <div className="ui left icon input">
                    <input type="text" placeholder="example@gmail.com" />
                    <i className="user icon"></i>
                  </div>
                </div>
                <div className="field">
                  <label>Password</label>
                  <div className="ui left icon input">
                    <input type="password" />
                    <i className="lock icon"></i>
                  </div>
                </div>
                <div className="fluid ui blue submit button mobile only row">Sign In
                </div>
              </div>
            </div>
            <div className="ui vertical divider">
              or
            </div>
            <div className="center aligned column">
              <a className="large blue ui labeled icon button"
                href="/auth/facebook">
                <i className="facebook icon"></i>
                Sign In with Facebook
              </a>
              <div className="ui hidden divider" />
              <div className="large red ui labeled icon button">
                <i className="google icon"></i>
                Sign In with Google
              </div>
              <div className="ui hidden divider"></div>
              <div className="huge green ui labeled icon button">
                <i className="signup icon"></i>
                Sign Up
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}

export default LoginHandler;