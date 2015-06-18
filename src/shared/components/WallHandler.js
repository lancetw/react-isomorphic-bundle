import React from 'react';
import Wall from './WallComponent';
import FluxComponent from 'flummox/component';

const WallHandler = class WallHandler extends React.Component{
  displayName: 'Wall'

  static async routerWillRun({flux, state}) {
    const pagesActions = flux.getActions('page');
    return await pagesActions.setTitle('Wall');
  }

  componentWillMount() {
    this.props.flux.getActions('post').list();
  }

  render() {
    return (
      <FluxComponent connectToStores={['user']}>
        <Wall />
      </FluxComponent>
    );
  }
};

export default WallHandler;
