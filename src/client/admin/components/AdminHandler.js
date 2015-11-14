import React, { Component, PropTypes } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

if (process.env.BROWSER) {
  require('css/ui/base')
  require('css/ui/admin')
  require('css/animation')
  require('css/admin')
  require('css/addon/csshake.min')
  require('css/images')
  require('sweetalert/dist/sweetalert')
}

export default class AdminHandler extends Component {

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
      <ReactCSSTransitionGroup
        transitionName="RouteTransition"
        transitionEnterTimeout={500}
        transitionLeaveTimeout={500}>
        {this.props.children}
      </ReactCSSTransitionGroup>
    )
  }
}
