import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import LocaleSwitcher from './LocaleSwitcher'

export default class Header extends React.Component {

  constructor (props) {
    super(props)
    props.sync()
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    sync: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
  }

  render () {
    const Translate = require('react-translate-component')
    const TranslateProps = React.createFactory(Translate)
    const searchProps = {
      component: 'input',
      type: 'search',
      name: 'q',
      scope: 'search_input',
      attributes: {
        placeholder: 'placeholder',
        title: 'tooltip'
      }
    }

    let AuthLink
    if (!this.props.auth.token)
      AuthLink = (
        <Link to='/login' className="item">
          <Translate content="header.login" />
        </Link>
      )
    else
      AuthLink = (
        <Link to='/logout' className="item">
          <Translate content="header.logout" />
        </Link>
      )

    let ChangePasswordLink
    if (this.props.auth.token)
      ChangePasswordLink = (
        <Link to='/password' className="item">
          <Translate content="header.password" />
        </Link>
      )

    return (
      <header className="ui orange inverted menu grid fixed top">
        <div className="computer tablet only row">
          <div className="left menu">
            <Link to='/home' className="item">
              <Translate content="header.home" />
            </Link>
            {AuthLink}
            <Link to='/wall/today' className="item">
              <Translate content="header.wall" />
            </Link>
            <Link to='/post' className="item">
              <Translate content="header.post" />
            </Link>
            {ChangePasswordLink}
          </div>

          <div className="right menu">
            <LocaleSwitcher dispatch={this.props.dispatch} />
            <div className="item">
              <div className="ui transparent icon input inverted">
                {TranslateProps(searchProps)}
                <i className="search icon"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="mobile only row">
          <div className="left menu">
            <Link className="item left" to="wall">
              <Translate content="header.home" />
            </Link>
            <Link to='post' className="item">
              <Translate content="header.post" />
            </Link>
          </div>
          <div className="right menu">
            <LocaleSwitcher dispatch={this.props.dispatch} />
            {AuthLink}
          </div>
        </div>
      </header>
    )
  }
}
