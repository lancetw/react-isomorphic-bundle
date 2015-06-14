import React from 'react';
import Header from './HeaderComponent';
import FluxComponent from 'flummox/component';

class HeaderHandler extends React.Component{
  displayName: 'Header'

  /*constructor(props) {
    super(props);
  }*/

  render() {
    return (
      <FluxComponent connectToStores={['auth']}>
        <Header />
      </FluxComponent>
    );
  }
}

HeaderHandler.contextTypes = {
  router: React.PropTypes.func.isRequired,
  flux: React.PropTypes.object.isRequired
};

export default HeaderHandler;
