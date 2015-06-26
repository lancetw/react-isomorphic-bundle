import React, { PropTypes } from 'react'
import BaseComponent from 'shared/components/BaseComponent'

export default class HomeComponent extends BaseComponent {

  constructor (props) {
    super(props)
  }

  static propTypes = {
    sync: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
  }

  componentWillMount () {
    this.props.sync()
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

    return (
      <main className="ui stackable page grid">
        <div className="column">
          <div className="ui segment">
            <h1><Translate content="home.jwt_header" /></h1>
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

