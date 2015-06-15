import React from 'react';
import ChangePassword from './ChangePasswordComponent';
import FluxComponent from 'flummox/component';
import auth from './addon/require-auth';

const ChangePasswordHandler = auth(class ChangePasswordHandler extends React.Component{
  displayName: 'Change Password'

  /*constructor(props) {
    super(props);
  }*/

  static async routerWillRun({flux, state}) {
    const pagesActions = flux.getActions('page');
    return await pagesActions.setTitle('Change Password');
  }

  render() {
    return (
      <FluxComponent connectToStores={['auth']}>
        <ChangePassword />
      </FluxComponent>
    );
  }
});

export default ChangePasswordHandler;
