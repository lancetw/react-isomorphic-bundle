import React, { Component, PropTypes } from 'react'

const Menu = require('react-burger-menu').slide

export default class RightSidebar extends Component {

  static propTypes = {
    children: PropTypes.any,
    isOpen: PropTypes.bool,
    isMenuOpen: PropTypes.func
  }

  static contextTypes = {
    history: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)
  }

  render () {
    return (
      <div className="right-sidebar">
        <Menu
          right
          onStateChange={ this.props.isMenuOpen }
          isOpen={ this.props.isOpen }
          width={ 270 }
          pageWrapId={'page-wrap'}
          outerContainerId={'outer-container'}>
          <div>
            { this.props.children }
          </div>
        </Menu>
      </div>
    )
  }
}
