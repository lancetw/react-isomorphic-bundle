import React, { PropTypes } from 'react/addons'

const { CSSTransitionGroup } = React.addons

if (process.env.BROWSER) {
  require('css/ui/base')
  require('css/ui/admin')
  require('css/animation')
  require('css/admin')
  require('css/addon/csshake.min')
  require('css/images')
}

export default class AdminHandler extends React.Component {

  static propTypes = {
    children: PropTypes.any
  }

  constructor (props, context) {
    super(props, context)
  }

  componentDidMount () {
    require('fastclick').attach(document.body)
  }

  render () {
    return (
      <CSSTransitionGroup transitionName="RouteTransition">
        {this.props.children}
      </CSSTransitionGroup>
    )
  }
}


