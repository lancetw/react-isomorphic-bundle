import React from 'react';
import BaseComponent from 'shared/components/BaseComponent';
import {isEmpty} from 'lodash';
import classNames from 'classnames';
import moment from 'moment';

const ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

class PostCard extends BaseComponent{
  displayName: 'PostCard Component'

  constructor(props) {
    super(props);
    this.state = {};

    //this._bind();
  }

  render() {
    const card = this.props.data;

    return (
      <div className="ui fluid card">
        <div className="content">
          <div className="header">{card.title}</div>
          <div className="meta">
            <span className="right floated time">{moment(card.startDate).format('M/D')} ~ {moment(card.endDate).format('M/D')}</span>
            <span className="category">{card.prop}</span>
          </div>
          <div className="description">
            <p></p>
          </div>
        </div>
        <div className="extra content">
          <span className="left floated">
            <i className="user icon"></i>
            75 Views
          </span>
          <span className="right floated like">
            <i className="like icon"></i>
            Chinese Christian Network Development Association
          </span>
        </div>
      </div>
    );
  }
}

export default PostCard;
