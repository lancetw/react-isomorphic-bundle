import React, { PropTypes } from 'react/addons'
import Header from './HeaderHandler'
import counterpart from 'counterpart'

const { CSSTransitionGroup } = React.addons

if (process.env.BROWSER) {
  require('css/ui/base')
  require('css/animation')
  require('css/screen')
}

export default class AppHandler extends React.Component {

  constructor (props) {
    super(props)
  }

  static propTypes = {
    children: PropTypes.any
  }

  componentDidMount () {
    require('fastclick').attach(document.body)
  }

  render () {
    return (
      <div>
        <Header/>
        <CSSTransitionGroup transitionName="RouteTransition">
          {this.props.children}
        </CSSTransitionGroup>
      </div>
    )
  }
}


