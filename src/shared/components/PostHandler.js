import React from 'react';
import {Link} from 'react-router';

class LoginHandler extends React.Component {
  displayName: 'Post'

  static async routerWillRun({ flux, state }) {
    const pagesActions = flux.getActions('page');
    return await pagesActions.setTitle('Post new message');
  }

  render() {
    return (
      <main className="ui stackable page grid">
        <div className="column">
          <div className="ui form">
            <div className="two fields">
              <div className="field">
                <div className="ui tag labels">
                  <a className="ui large orange tag label">Event</a>
                  <a className="ui large blue tag label">Basic</a>
                </div>
                <div className="ui hidden divider"></div>
                <div className="required field">
                  <input type="text" placeholder="event name" />
                </div>
                <div className="field">
                  <a className="ui large teal label">Every Week</a>
                  <a className="ui large black label">Sunday</a>
                  <a className="ui large red label">12:30 ~ 15:30</a>
                </div>
              </div>
              <div className="required field">
                <label>Detail</label>
                <textarea></textarea>
              </div>
            </div>
            <div className="ui hidden divider"></div>
            <div className="field">
              <div className="ui checkbox">
                <input type="checkbox" name="tos-check" />
                <label>I agree to the <a role="botton" href="#">Terms and Conditions</a></label>
              </div>
            </div>
            <div className="ui divider"></div>
            <div className="field">
              <div className="large green ui labeled icon button">
                <i className="check circle outline icon"></i>
                Post it!
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}

export default LoginHandler;
