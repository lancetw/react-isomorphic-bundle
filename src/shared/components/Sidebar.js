import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

const Menu = require('react-burger-menu').bubble

class Sidebar extends React.Component {

  static propTypes = {
    children: PropTypes.any
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
        { this.props.children }
      </Menu>
    )
  }
}

export default connect(state => ({
}))(Sidebar)
