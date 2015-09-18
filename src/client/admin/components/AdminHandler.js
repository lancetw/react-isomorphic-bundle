import React, { PropTypes } from 'react/addons'

const { CSSTransitionGroup } = React.addons

if (process.env.BROWSER) {
  require('css/admin.css')
}

export default class AdminHandler extends React.Component {

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
        <CSSTransitionGroup transitionName="RouteTransition">
          {this.props.children}
        </CSSTransitionGroup>
      </div>
    )
  }
}


