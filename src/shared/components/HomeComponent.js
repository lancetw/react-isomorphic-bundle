import React, { PropTypes } from 'react'
import BaseComponent from 'shared/components/BaseComponent'

export default class HomeComponent extends BaseComponent {

  constructor (props) {
    super(props)
  }

  static propTypes = {
    load: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
  }

  componentWillMount () {
    this.props.load()
  }

  render () {
    return (
      <main className="ui stackable page grid">
        <div className="column">
          <div className="ui segment">
            <h1>Your JSON Web Token</h1>
            <div className="ui fluid right labeled left icon input">
              <i className="tags icon"></i>
              <input
                type="text"
                placeholder="token"
                value={this.props.auth.token}
                readOnly
              />
              <div className="ui tag label">
                KEY
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }
}

