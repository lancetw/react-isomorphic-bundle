import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router'
import LocaleSwitcher from './LocaleSwitcher'
import Sidebar from './Sidebar'
import classNames from 'classnames'

export default class Header extends Component {

  static propTypes = {
    dispatch: PropTypes.func,
    searchPost: PropTypes.func.isRequired,
    sync: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    search: PropTypes.object.isRequired
  }

  static contextTypes = {
    history: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)

    this.state = { userInput: '', hideSearchBox: true }

    this.releaseTimeout = undefined
    this.searchboxTimeout = undefined
  }

  componentWillUnmount () {
    if (this.op) {
      clearTimeout(this.releaseTimeout)
      clearTimeout(this.searchboxTimeout)
    }
  }

  handleChange = (event) => {
    this.setState({ userInput: event.target.value })
  }

  handleFocus = () => {
    this.setState({ userInput: '' })
  }

  handleBlur = () => {
    this.setState({ hideSearchBox: true })
  }

  doSubmit = (event) => {
    const pattern = this.state.userInput
    if (!pattern) return

    if (process.env.BROWSER) {
      event.target.blur()
      this.props.searchPost(pattern, 0, 20, true)
      this.releaseTimeout =
        setTimeout(() => this.context.history.replaceState({}, '/search'), 500)
    }
  }

  handleSubmit = (event) => {
    if (event.which === 13) {
      event.preventDefault()
      this.doSubmit(event)
    }
  }

  handleSearchSubmit = (event) => {
    event.preventDefault()
    this.doSubmit(event)
  }

  handleSearchBox = (event) => {
    event.preventDefault()
    this.setState({ hideSearchBox: !this.state.hideSearchBox })
    this.searchboxTimeout =setTimeout(() => {
      ReactDOM.findDOMNode(this.refs.search).focus()
    }, 500)
  }

  render () {
    const { dispatch, auth } = this.props

    const Translate = require('react-translate-component')

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

    const SearchBox = (
      <form
        className="item"
        action=""
        method="post"
        onSubmit={this.handleSearchSubmit}>
        <div className="ui inverted transparent icon input">
          <input
            type="search"
            ref="search"
            onChange={this.handleChange}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            onKeyDown={this.handleSubmit}
            value={this.state.userInput}
          />
          <i
            onClick={this.handleSearchSubmit}
            className="search inverted link icon">
          </i>
          <input type="submit" className="hide-submit" />
        </div>
      </form>
    )

    const searchBoxClasses = classNames(
      'right',
      'fluid',
      'menu',
      'searchbox-switch',
      { 'show': !this.state.hideSearchBox },
      { 'hide': this.state.hideSearchBox }
    )

    const siteTitleClasses = classNames(
      'item',
      'inverted',
      'header',
      'searchbox-switch',
      { 'show': this.state.hideSearchBox },
      { 'hide': !this.state.hideSearchBox }
    )

    return (
      <header
        className="ui orange top inverted pointing menu grid fixed top">
        <div className="computer tablet only row">
          <div className="left menu">
            <Link to="/home" className="item">
              <Translate content="header.home" />
            </Link>
            <Link to="/nearby" className="item">
              <Translate content="header.nearby" />
            </Link>
            <Link to="/w/cal" className="item">
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
            {SearchBox}
          </div>
        </div>
        <div className="mobile only row">
          <div className="left menu">
            <Sidebar>
              <Link to="/home" className="link item">
                <Translate content="header.home" />
              </Link>
              <Link to="/nearby" className="link item">
                <Translate content="header.nearby" />
              </Link>
              <Link to="/w/today" className="link item">
                <Translate content="header.wall" />
              </Link>
              <Link to="/post" className="link item">
                <Translate content="header.post" />
              </Link>
              {ChangePasswordLink}
              {ManageLink}
              {AuthLink}
            </Sidebar>
          </div>
          <a
            onClick={this.handleSearchBox}
            className={siteTitleClasses}>
            <Translate content="title.site" />
          </a>
          <div className={searchBoxClasses}>
            {SearchBox}
          </div>
        </div>
      </header>
    )
  }
}
