import React from 'react';
import ChangePassword from './ChangePasswordComponent';
import FluxComponent from 'flummox/component';
import auth from './addon/require-auth';

const ChangePasswordHandler = auth(class ChangePasswordHandler extends React.Component{
  displayName: 'Change Password'

  componentWillMount() {
    const pagesActions = this.props.flux.getActions('page');
    pagesActions.setTitle('Change Password');
  }

  render() {
    return (
      <FluxComponent connectToStores={['user']}>
        <ChangePassword />
      </FluxComponent>
    );
  }
});

export default ChangePasswordHandler;
