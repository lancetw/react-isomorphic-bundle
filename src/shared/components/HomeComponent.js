/* eslint-disable max-len */
import React, { PropTypes } from 'react'
import BaseComponent from 'shared/components/BaseComponent'
import MediaQuery from 'react-responsive'
import Ad from 'shared/components/addon/ad'

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

          <div className="ui basic center aligned segment">
            <MediaQuery minDeviceWidth={769}>
              <Ad id="1L" link="http://mx1.hotrank.com.tw/script/oursweb/All_468x40" />
            </MediaQuery>
            <MediaQuery maxDeviceWidth={768}>
              <Ad id="1S" link="http://mx1.hotrank.com.tw/script/oursweb/200x200" />
            </MediaQuery>
          </div>
        </div>
      </main>
    )
  }
}
