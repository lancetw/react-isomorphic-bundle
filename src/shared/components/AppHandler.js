import React, { PropTypes } from 'react/addons'
import Header from './HeaderHandler'
const { CSSTransitionGroup } = React.addons

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
        <CSSTransitionGroup transitionName="RouteTransition">
          {this.props.children}
        </CSSTransitionGroup>
      </div>
    )
  }
}


