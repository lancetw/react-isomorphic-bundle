import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import LocaleSwitcher from './LocaleSwitcher'

export default class Header extends React.Component {

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

  constructor (props) {
    super(props)

    this.state = { userInput: '' }

    this.releaseTimeout = undefined
  }

  componentWillUnmount () {
    if (this.op) {
      clearTimeout(this.releaseTimeout)
    }
  }

  handleChange (event) {
    this.setState({ userInput: event.target.value })
  }

  handleFocus () {
    this.setState({ userInput: '' })
  }

  doSubmit () {
    const pattern = this.state.userInput
    if (!pattern) return

    if (process.env.BROWSER) {
      this.props.searchPost(pattern, 0, 10, true)
      this.releaseTimeout =
        setTimeout(() => this.context.router.replaceWith('/search'), 500)
    }

    React.findDOMNode(this.refs.search).blur()
  }

  handleSubmit (event) {
    if (event.which === 13) {
      event.preventDefault()
      this.doSubmit()
    }
  }

  handleSearchSubmit (event) {
    event.preventDefault()
    this.doSubmit()
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
    if (!auth.token) {
      AuthLink = (
        <Link to="/login" className="item">
          <Translate content="header.login" />
        </Link>
      )
    } else {
      AuthLink = (
        <Link to="/logout" className="item">
          <Translate content="header.logout" />
        </Link>
      )
    }

    let ChangePasswordLink
    if (auth.token) {
      ChangePasswordLink = (
        <Link to="/password" className="item">
          <Translate content="header.password" />
        </Link>
      )
    }

    let ManageLink
    if (auth.token) {
      ManageLink = (
        <Link to="/manage" className="item">
          <Translate content="header.manage" />
        </Link>
      )
    }

    return (
      <header
        className="ui orange top inverted pointing menu grid fixed top">
        <div className="computer tablet only row">
          <div className="left menu">
            <Link to="/home" className="item">
              <Translate content="header.home" />
            </Link>
            <Link to="/wall" className="item">
              <Translate content="header.wall" />
            </Link>
            <Link to="/post" className="item">
              <Translate content="header.post" />
            </Link>
            {ChangePasswordLink}
            {ManageLink}
          </div>

          <div className="right menu">
            {AuthLink}
            <LocaleSwitcher dispatch={dispatch} />
            <div className="item">
              <form
                action=""
                method="post"
                onSubmit={::this.handleSearchSubmit}>
                <div className="ui transparent icon input">
                  <input
                    type="search"
                    ref="search"
                    onChange={::this.handleChange}
                    onFocus={::this.handleFocus}
                    onKeyDown={::this.handleSubmit}
                    value={this.state.userInput}
                  />
                  <i className="search link icon"></i>
                  <input type="submit" className="hide-submit" />
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="mobile only row">
          <div className="left menu">
            <Link to="/wall/today" className="item left">
              <Translate content="header.home" />
            </Link>
            <Link to="/post" className="item">
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
