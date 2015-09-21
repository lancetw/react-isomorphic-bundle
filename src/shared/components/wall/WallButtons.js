import React from 'react'
import { Link } from 'react-router'

export default class WallButtons extends React.Component {

  static propTypes = {}

  constructor (props) {
    super(props)
  }

  render () {
    const Translate = require('react-translate-component')
    return (
      <div className="switch-btns">
        <div className="ui red small buttons">
          <Link className="ui button" to="/w/today">
            <Translate content="header.overview" />
          </Link>
          <Link className="ui button" to="/w/cprop">
            <Translate content="header.cprop" />
          </Link>
          <Link className="ui button" to="/w/cal">
            <Translate content="header.cal" />
          </Link>
        </div>
      </div>
    )
  }
}
