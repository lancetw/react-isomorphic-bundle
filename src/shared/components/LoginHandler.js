import React from 'react';
import BaseComponent from 'shared/components/BaseComponent';
import {Link} from 'react-router';

class LoginHandler extends BaseComponent {
  displayName: 'Log in'

  constructor(props) {
    super(props);
  }

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
                    <input type="text" placeholder="example@email.com" />
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
              <Link className="large blue ui labeled icon button"
                to="/auth/facebook">
                <i className="facebook icon"></i>
                Sign In with Facebook
              </Link>
              <div className="ui hidden divider"></div>
              <Link className="huge green ui labeled icon button"
                to="/signup">
                <i className="signup icon"></i>
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }
}

LoginHandler.contextTypes = {
  router: React.PropTypes.func.isRequired
};

export default LoginHandler;
