import React from 'react';
import BaseComponent from 'shared/components/BaseComponent';
import {isEmpty} from 'lodash';
import classNames from 'classNames';

const ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

class Wall extends BaseComponent{
  displayName: 'Wall Component'

  constructor(props, context) {
    super(props);
    this.state = {};

    //this._bind();
  }

  render() {

    return (
      <main className="ui stackable page centered grid">
        <div className="column">
          <div className="ui cards">

            <div className="ui fluid card">
              <div className="content">
                <div className="header">An event title you can see</div>
                <div className="meta">
                  <span className="right floated time">6/30 ~ 7/12</span>
                  <span className="category">Music</span>
                </div>
                <div className="description">
                  <p></p>
                </div>
              </div>
              <div className="extra content">
                <span className="right floated like">
                  <i className="like icon"></i>
                  Chinese Christian Network Development Association
                </span>
                <span>
                  <i className="user icon"></i>
                  75 Views
                </span>
              </div>
            </div>

            <div className="ui fluid card">
              <div className="content">
                <div className="header">An event title you can see</div>
                <div className="meta">
                  <span className="right floated time">6/30 ~ 7/12</span>
                  <span className="category">Music</span>
                </div>
                <div className="description">
                  <p></p>
                </div>
              </div>
              <div className="extra content">
                <span className="right floated like">
                  <i className="like icon"></i>
                  Chinese Christian Network Development Association
                </span>
                <span>
                  <i className="user icon"></i>
                  75 Views
                </span>
              </div>
            </div>

            <div className="ui fluid card">
              <div className="content">
                <div className="header">An event title you can see</div>
                <div className="meta">
                  <span className="right floated time">6/30 ~ 7/12</span>
                  <span className="category">Music</span>
                </div>
                <div className="description">
                  <p></p>
                </div>
              </div>
              <div className="extra content">
                <span className="right floated like">
                  <i className="like icon"></i>
                  Chinese Christian Network Development Association
                </span>
                <span>
                  <i className="user icon"></i>
                  75 Views
                </span>
              </div>
            </div>

            <div className="ui fluid card">
              <div className="content">
                <div className="header">An event title you can see</div>
                <div className="meta">
                  <span className="right floated time">6/30 ~ 7/12</span>
                  <span className="category">Music</span>
                </div>
                <div className="description">
                  <p></p>
                </div>
              </div>
              <div className="extra content">
                <span className="right floated like">
                  <i className="like icon"></i>
                  Chinese Christian Network Development Association
                </span>
                <span>
                  <i className="user icon"></i>
                  75 Views
                </span>
              </div>
            </div>

            <div className="ui fluid card">
              <div className="content">
                <div className="header">An event title you can see</div>
                <div className="meta">
                  <span className="right floated time">6/30 ~ 7/12</span>
                  <span className="category">Music</span>
                </div>
                <div className="description">
                  <p></p>
                </div>
              </div>
              <div className="extra content">
                <span className="right floated like">
                  <i className="like icon"></i>
                  Chinese Christian Network Development Association
                </span>
                <span>
                  <i className="user icon"></i>
                  75 Views
                </span>
              </div>
            </div>

            <div className="ui fluid card">
              <div className="content">
                <div className="header">An event title you can see</div>
                <div className="meta">
                  <span className="right floated time">6/30 ~ 7/12</span>
                  <span className="category">Music</span>
                </div>
                <div className="description">
                  <p></p>
                </div>
              </div>
              <div className="extra content">
                <span className="right floated like">
                  <i className="like icon"></i>
                  Chinese Christian Network Development Association
                </span>
                <span>
                  <i className="user icon"></i>
                  75 Views
                </span>
              </div>
            </div>

          </div>
        </div>
      </main>
    );
  }
}

export default Wall;
