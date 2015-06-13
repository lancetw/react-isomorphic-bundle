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

export default HeaderHandler;
