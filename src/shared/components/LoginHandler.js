import React from 'react';
import Login from './LoginComponent';
import FluxComponent from 'flummox/component';

class LoginHandler extends React.Component{
  displayName: 'Log In'

  /*constructor(props) {
    super(props);
  }*/

  static async routerWillRun({flux, state}) {
    const pagesActions = flux.getActions('page');
    return await pagesActions.setTitle('Please Log in');
  }

  render() {
    return (
      <FluxComponent connectToStores={['auth']}>
        <Login />
      </FluxComponent>
    );
  }
}

export default LoginHandler;
