import React from 'react';
import Logout from './LogoutComponent';
import FluxComponent from 'flummox/component';

class LogoutHandler extends React.Component{
  displayName: 'Log Out'

  /*constructor(props) {
    super(props);
  }*/

  static async routerWillRun({flux, state}) {
    const pagesActions = flux.getActions('page');
    return await pagesActions.setTitle('Log out');
  }

  render() {
    return (
      <FluxComponent connectToStores={['auth']}>
        <Logout />
      </FluxComponent>
    );
  }
}

export default LogoutHandler;
