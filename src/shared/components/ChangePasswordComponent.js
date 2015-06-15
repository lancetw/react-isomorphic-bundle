import React from 'react';
import BaseComponent from 'shared/components/BaseComponent';

class ChangePasswordComponent extends BaseComponent{
  displayName: 'Change Password Component'

  /*constructor(props) {
    super(props);
  }*/

  render() {
    return (
      <main className="ui stackable page grid">
        <div className="column">
          <div className="ui segment">
            <form className="ui form">
              <h4 className="ui dividing header">Change Password</h4>
              <div className="three fields">
                <div className="field">
                  <div className="ui fluid right labeled left icon input">
                    <i className="warning circle icon"></i>
                    <input type="text" placeholder="New Password" />
                  </div>
                </div>
                <div className="field">
                  <div className="ui fluid right labeled left icon input">
                    <i className="warning circle icon"></i>
                    <input type="text" placeholder="New Password Again" />
                  </div>
                </div>
                <div className="field">
                  <button className="ui primary button">
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    );
  }
}

export default ChangePasswordComponent;
