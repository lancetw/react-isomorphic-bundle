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
        <div className="ui orange inverted buttons">
          <Link className="ui button" to="/wall/today">
            <Translate content="header.wall" />
          </Link>
          <Link className="ui button" to="/wall/cal">
            <Translate content="header.cal" />
          </Link>
          <Link className="ui button" to="/wall/cprop">
            <Translate content="header.cprop" />
          </Link>
        </div>
      </div>
    )
  }
}
