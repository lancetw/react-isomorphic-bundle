import React from 'react';
import BaseComponent from 'shared/components/BaseComponent';
import {isEmpty} from 'lodash';
import Cards from 'shared/components/wall/PostCards';
import FluxComponent from 'flummox/component';

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
          <FluxComponent connectToStores={['post']}>
            <Cards />
          </FluxComponent>
        </div>
      </main>
    );
  }
}

export default Wall;
