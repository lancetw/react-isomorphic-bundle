import React, { PropTypes } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import Header from './HeaderHandler'

if (process.env.BROWSER) {
  require('css/ui/base')
  require('css/animation')
  require('css/screen')
  require('css/addon/csshake.min')
  require('css/images')
  require('css/addon/pin')
}

export default class AppHandler extends React.Component {

  static propTypes = {
    children: PropTypes.any
  }

  constructor (props) {
    super(props)
  }

  componentDidMount () {
    require('fastclick').attach(document.body)
  }

  render () {
    return (
      <div>
        <Header/>
        <ReactCSSTransitionGroup
          transitionName="RouteTransition"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}>
          {this.props.children}
        </ReactCSSTransitionGroup>
      </div>
    )
  }
}
