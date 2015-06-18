import React from 'react';
import BaseComponent from 'shared/components/BaseComponent';
import {isEmpty} from 'lodash';
import classNames from 'classnames';
import Card from 'shared/components/wall/PostCard';

const ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

class PostCards extends BaseComponent{
  displayName: 'PostCards Component'

  constructor(props) {
    super(props);
    this.state = {};

    //this._bind();
  }

  componentDidMount() {
  }

  render() {
    const cards = this.props.posts;
    return (
      <div className="ui cards">
        {!isEmpty(cards) && cards.map(function (card) {
          return <Card key={card.id} data={card} />;
        })}
      </div>
    );
  }
}

export default PostCards;
