import React, { Component } from 'react'
import { Link } from 'react-router'

export default class NotFound extends Component {

  render () {
    return (
      <main className="ui stackable page grid">
        <div className="column">
          <div className="ui segment">
            <h1>HTTP 404</h1>
          </div>
        </div>
      </main>
    )
  }
}
