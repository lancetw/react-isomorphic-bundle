import React, { PropTypes } from 'react'
import { BaseComponent } from 'shared/components'

export default class HomeComponent extends BaseComponent {

  constructor (props) {
    super(props)
  }

  static propTypes = {
    auth: PropTypes.object.isRequired
  }

  render () {
    const Translate = require('react-translate-component')
    const TranslateProps = React.createFactory(Translate)
    const tokenProps = {
      component: 'input',
      type: 'text',
      name: 'token',
      scope: 'home_token',
      readOnly: true,
      attributes: {
        placeholder: 'placeholder'
      },
      value: this.props.auth.token
    }

    const { user } = this.props.auth

    return (
      <main className="ui column centered stackable page grid">
        <div className="column">
          <div className="ui segment">
            {user.email && <div className="ui orange label">{user.email}</div>}
            <h2>
              <Translate content="home.jwt_header" />
            </h2>
            <div className="ui fluid right labeled left icon input">
              <i className="tags icon"></i>
              {TranslateProps(tokenProps)}
              <div className="ui tag label">
                <Translate content="home.key" />
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }
}
