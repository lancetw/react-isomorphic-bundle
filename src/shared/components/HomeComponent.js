import React from 'react';
import BaseComponent from 'shared/components/BaseComponent';

class HomeComponent extends BaseComponent{
  displayName: 'Home Component'

  /*constructor(props) {
    super(props);
  }*/

  render() {
    return (
      <main className="ui stackable page grid">
        <div className="column">
          <div className="ui segment">
            <h1>Hello World!</h1>
            <p>{this.props.token}</p>
          </div>
        </div>
      </main>
    );
  }
}

export default HomeComponent;
