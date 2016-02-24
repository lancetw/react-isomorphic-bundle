import React, { Component, PropTypes } from 'react'
import { detectIE } from 'shared/utils/browser-utils'

const Menu = require('react-burger-menu').stack

export default class Sidebar extends Component {

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
      <Menu
        onStateChange={ this.props.isMenuOpen }
        isOpen={ this.props.isOpen }
        width={ 230 }
        pageWrapId={'page-wrap'}
        outerContainerId={'outer-container'}>
        <div>
          { this.props.children }
        </div>
      </Menu>
    )
  }
}
