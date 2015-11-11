import React, { PropTypes } from 'react'

const Menu = require('react-burger-menu').bubble

export default class Sidebar extends React.Component {

  static propTypes = {
    children: PropTypes.any
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

