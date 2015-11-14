import React, { Component } from 'react'
import { Link } from 'react-router'

export default class WallButtons extends Component {

  static propTypes = {}

  constructor (props) {
    super(props)
  }

  render () {
    const Translate = require('react-translate-component')
    return (
      <div className="switch-btns">
        <div className="ui red small buttons">
          <Link activeClassName="active" className="ui button" to="/w/today">
            <Translate content="header.overview" />
          </Link>
          <Link activeClassName="active" className="ui button" to="/w/cal">
            <Translate content="header.cal" />
          </Link>
          <Link activeClassName="active" className="ui button" to="/w/cprop">
            <Translate content="header.cprop" />
          </Link>
        </div>
      </div>
    )
  }
}
