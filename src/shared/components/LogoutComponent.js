import React from 'react';
import BaseComponent from 'shared/components/BaseComponent';
import {Link} from 'react-router/build/npm/lib';

class Logout extends BaseComponent{
  displayName: 'Log out Component'

  componentDidMount() {
    const authActions = this.props.flux.getActions('auth');
    authActions.revoke(this.props.token);

    setTimeout(() => this.context.router.transitionTo('/auth/logout'), 0);
  }

  render() {
    return (
      <main className="ui stackable page grid">
        <div className="column">
          <div className="segment">
            If You want to log out, <Link to="/auth/logout">click here.</Link>
          </div>
        </div>
      </main>
    );
  }
}

Logout.contextTypes = {
  router: React.PropTypes.func.isRequired
};


export default Logout;
