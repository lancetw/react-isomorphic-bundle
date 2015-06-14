import React from 'react';
import FluxComponent from 'flummox/component';
import Home from './HomeComponent';

class HomeHandler extends React.Component {
  displayName: 'Home'

  static async routerWillRun({flux, state}) {
    const pagesActions = flux.getActions('page');
    return await pagesActions.setTitle('Homepage');
  }

  render() {
    return (
      <FluxComponent connectToStores={['auth']}>
        <Home />
      </FluxComponent>
    );
  }
}

export default HomeHandler;
