import React from 'react';
import BaseComponent from 'shared/components/BaseComponent';

class Logout extends BaseComponent{
  displayName: 'Log out Component'

  componentWillMount() {
    const authActions = this.props.flux.getActions('auth');
    authActions.revoke(this.props.token);
    this.context.router.transitionTo('/api/v1/logout');
  }

  render() {
    return (
      <main className="ui stackable page grid">
        <div className="column">
          <div className="segment">
            Log Out
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
