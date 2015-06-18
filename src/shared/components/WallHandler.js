import React from 'react';
import Wall from './WallComponent';
import FluxComponent from 'flummox/component';

const WallHandler = class WallHandler extends React.Component{
  displayName: 'Wall'

  static async routerWillRun({flux, state}) {
    const pagesActions = flux.getActions('page');
    return await pagesActions.setTitle('Wall');
  }

  render() {
    return (
      <FluxComponent connectToStores={['post', 'user']}>
        <Wall />
      </FluxComponent>
    );
  }
};

export default WallHandler;
