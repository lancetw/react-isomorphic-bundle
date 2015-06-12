import React from 'react';
import {Link} from 'react-router';
import Signup from './SignupComponent';
import FluxComponent from 'flummox/component';

class SignupHandler extends React.Component{
  displayName: 'Signup'

  static async routerWillRun({flux, state}) {
    const pagesActions = flux.getActions('page');
    return await pagesActions.setTitle('Sign Up');
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <FluxComponent connectToStores={['signup']}>
        <Signup />
      </FluxComponent>
    );
  }
}

export default SignupHandler;
