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
            <h1>Your JSON Web Token</h1>
            <div className="ui fluid right labeled left icon input">
              <i className="tags icon"></i>
              <input type="text" placeholder="token" value={this.props.token} readOnly />
              <div className="ui tag label">
                KEY
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}

export default HomeComponent;
