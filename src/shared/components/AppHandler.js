import React from 'react/addons';
import {RouteHandler} from 'react-router';

const {CSSTransitionGroup} = React.addons;

if (process.env.BROWSER) {
  require('css/ui');
  require('css/app');
}

class AppHandler extends React.Component {
  displayName: 'AppHandler'

  static willTransitionTo(transition) {
    const { path } = transition;

    if (path !== '/' && path.endsWith('/')) {
      transition.redirect(path.substring(0, path.length - 1));
    }
  }

  componentDidMount() {
    require('fastclick').attach(document.body);
  }

  render() {
    return (
      <div>
        <CSSTransitionGroup transitionName="RouteTransition">
          <RouteHandler {...this.props} key={this.props.pathname} />
        </CSSTransitionGroup>
      </div>
    );
  }
}

export default AppHandler;

