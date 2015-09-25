import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import {
  Menu,
  MembersTable as Table,
  MembersNav as Nav
} from 'client/admin/components/widget'

export default class MembersDetail extends React.Component {

  constructor (props) {
    super(props)
  }

  render () {
    return (
      <main className="ui column page grid container">
        <div className="column">
          <div className="row">
            <div className="image logo"></div>
          </div>
          <Menu {...this.props} />
          <div className="ui grid">
            <div className="four wide column">
              <Nav {...this.props} />
            </div>
            <div className="twelve wide stretched column">
              <Table {...this.props} />
            </div>
          </div>
        </div>
      </main>
    )
  }
}
