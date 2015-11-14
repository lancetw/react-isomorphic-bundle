import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import {
  Menu,
  Detail,
  MembersTable as Table,
  MembersNav as Nav
} from 'client/admin/components/widget'

export default class MembersDetail extends Component {

  constructor (props) {
    super(props)
  }

  render () {
    return (
      <main className="ui column page grid container">
        <div className="column">
          <div className="row">
            <div className="image logo admin"></div>
          </div>
          <Menu {...this.props} />
          <div className="ui stackable two column grid">
            <div className="centered column">
              <Detail {...this.props} />
            </div>
          </div>
        </div>
      </main>
    )
  }
}
