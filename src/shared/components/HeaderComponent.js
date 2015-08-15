import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import LocaleSwitcher from './LocaleSwitcher'

export default class Header extends React.Component {

  constructor (props) {
    super(props)

    this.releaseTimeout = undefined
  }

  static propTypes = {
    dispatch: PropTypes.func,
    searchPost: PropTypes.func.isRequired,
    sync: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    search: PropTypes.object.isRequired
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  handleSearchSubmit (event) {
    event.preventDefault()
    const pattern = React.findDOMNode(this.refs.search).value
    if (!pattern) return

    this.props.searchPost(pattern, null, null, true)

    if (process.env.BROWSER)
      this.releaseTimeout =
        setTimeout(() => this.context.router.replaceWith('/search'), 500)
  }

  componentWillUnmount () {
    if (this.op)
      clearTimeout(this.releaseTimeout)
  }

  render () {
    const { dispatch, auth } = this.props

    const Translate = require('react-translate-component')
    const TranslateProps = React.createFactory(Translate)

    const searchProps = {
      component: 'input',
      type: 'search',
      name: 'q',
      ref: 'search',
      scope: 'search_input',
      attributes: {
        placeholder: 'placeholder',
        title: 'tooltip'
      }
    }

    let AuthLink
    if (!auth.token)
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
    if (auth.token)
      ChangePasswordLink = (
        <Link to='/password' className="item">
          <Translate content="header.password" />
        </Link>
      )

    let ManageLink
    if (auth.token)
      ManageLink = (
        <Link to='/manage' className="item">
          <Translate content="header.manage" />
        </Link>
      )

    return (
      <header
        className="ui orange top pointing menu grid fixed top">
        <div className="computer tablet only row">
          <div className="left menu">
            <Link to='/home' className="item">
              <Translate content="header.home" />
            </Link>
            {AuthLink}
            <Link to='/wall' className="item">
              <Translate content="header.wall" />
            </Link>
            <Link to='/post' className="item">
              <Translate content="header.post" />
            </Link>
            {ChangePasswordLink}
            {ManageLink}
          </div>

          <div className="right menu">
            <LocaleSwitcher dispatch={dispatch} />
            <div className="item">
              <form
                onSubmit={::this.handleSearchSubmit}>
              <div className="ui transparent icon input">
                {TranslateProps(searchProps)}
                <i className="search icon"></i>
              </div>
              </form>
            </div>
          </div>
        </div>
        <div className="mobile only row">
          <div className="left menu">
            <Link className="item left" to="/wall/today">
              <Translate content="header.home" />
            </Link>
            <Link to='/post' className="item">
              <Translate content="header.post" />
            </Link>
            <LocaleSwitcher dispatch={dispatch} />
            {AuthLink}
          </div>
        </div>
      </header>
    )
  }
}
