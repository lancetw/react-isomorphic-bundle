import React from 'react';
import connectToStores from 'flummox/connect';

class HomeHandler extends React.Component {
  displayName: 'Home'

  render() {
    return (
      <div>
        <h1>NICE!!!!</h1>
        <div className="ui primary button">
          XD
        </div>
      </div>
    );
  }
}

export default HomeHandler;
