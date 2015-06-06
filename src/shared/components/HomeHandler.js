import React from 'react';
import connectToStores from 'flummox/connect';

class HomeHandler extends React.Component {
  displayName: 'Home'

  render() {
    return (
      <div>
        <h1>flummox-isomorphic-example</h1>
        <div className="ui primary button">
          測試成功
        </div>
      </div>
    );
  }
}

export default HomeHandler;
