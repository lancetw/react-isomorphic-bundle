import React from 'react';
import connectToStores from 'flummox/connect';
import {Link} from 'react-router';

class HomeHandler extends React.Component {
  displayName: 'Home'

  render() {
    return (
      <div>
        <h1>flummox-isomorphic-example</h1>
        <Link className="ui primary button" to="login">
          測試成功
        </Link>
      </div>
    );
  }
}

export default HomeHandler;
