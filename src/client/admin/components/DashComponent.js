import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import {
  Menu,
  Table,
  Pagination,
  Nav
} from 'client/admin/components/widget'

export default class Dash extends React.Component {

  static propTypes = {
    post: PropTypes.object.isRequired
  }

  static contextTypes = {
    history: PropTypes.object.isRequired
  }

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
