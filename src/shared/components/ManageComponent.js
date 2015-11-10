import React, { PropTypes } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { BaseComponent } from 'shared/components'
import { Link } from 'react-router'
import Cards from 'shared/components/wall/PostCards'
import {
  Form,
  ManageForm,
  ManageFormOptions
} from 'shared/utils/forms'
import { isEmpty, clone } from 'lodash'
import classNames from 'classnames'
import counterpart from 'counterpart'

let $
if (process.env.BROWSER) {
  $ = require('jquery')
}

export default class Manage extends BaseComponent {

  static propTypes = {
    post: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    loadFunc: PropTypes.func.isRequired,
    defaultLocale: PropTypes.string.isRequired,
    changeInfo: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)

    this._bind(
      'handleSubmit',
      'handleChange',
      'clearFormErrors'
    )
    this.messageTimeout = undefined
    this.releaseTimeout = undefined
    this.state = {
      formInited: false,
      value: {},
      options: ManageFormOptions(this.getLocale()),
      submited: false,
      updated: false
    }

    counterpart.onLocaleChange(::this.handleLocaleChange)
  }

  componentWillReceiveProps (nextProps) {
    if (!this.state.formInited) {
      if (this.initForm(nextProps.user.orginfo)) {
        this.setState({ formInited: true })
      }
    }

    this.validation(nextProps.user.errors)
    this.checkSubmited(nextProps.user._orginfo)
  }

  componentWillUnmount () {
    if (this.op) {
      clearTimeout(this.releaseTimeout)
    }
  }

  scrollToTop () {
    $('body').stop().animate({
      scrollTop: 0
    }, 600)
  }

  handleLocaleChange (newLocale) {
    if (process.env.BROWSER) {
      this.setState({
        options: ManageFormOptions(newLocale)
      })
    }
  }

  handleChange (value) {
    this.setState({ value })
  }

  handleSubmit (evt) {
    evt.preventDefault()

    const value = this.refs.form.getValue()

    if (value) {
      this.clearFormErrors()
      this.setState({ submited: true })
      this.scrollToTop()
      this.releaseTimeout = setTimeout(() => {
        this.props.changeInfo(value)
      }, 1000)
    }
  }

  clearFormErrors () {
    const options = clone(this.state.options)
    options.fields = clone(options.fields)

    for (const key in options.fields) {
      if (options.fields.hasOwnProperty(key)) {
        options.fields[key] = clone(options.fields[key])
        if (options.fields[key].hasOwnProperty('hasError')) {
          options.fields[key].hasError = false
        }
      }
    }
    this.setState({ options: options })
  }

  validation (errors) {
    if (!isEmpty(errors)) {
      this.setState({ submited: false })
    }
  }

  checkSubmited (info) {
    if (!isEmpty(info)) {
      this.setState({ submited: false })
      if (info.ocname) {
        this.setState({ updated: true })
      }
    }
  }

  initForm (info) {
    if (!isEmpty(info)) {
      this.setState({ value: info })
      return true
    }
    return false
  }

  render () {
    const Translate = require('react-translate-component')

    const LoadingClass = classNames(
      'ui',
      'form',
      'segment',
      {'loading': !!this.state.submited }
    )

    const Message = this.state.updated
      ? (
        <div className="ui success message">
          <div className="header">
            <Translate content="userinfo.modified.title" />
          </div>
          <p><Translate content="userinfo.modified.content" /></p>
        </div> )
      : null

    if (this.state.updated) {
      this.messageTimeout =
        setTimeout(() => this.setState({ updated: false }), 5000)
    }

    /* eslint-disable max-len */
    const { user } = this.props
    let cid
    if (user.orginfo.cid) cid = user.orginfo.cid
    if (user._orginfo.cid) cid = user._orginfo.cid
    const BindedMessage
      = !!cid
      ? (
        <div className="ui orange small icon message">
          <div className="content">
            <div className="header">
              <Link to={`/c/${cid}`}>
                已綁定華人教會機構名錄 ^_^
              </Link>
            </div>
          </div>
        </div> )
      : null

    const { post, auth, loadFunc } = this.props
    const loading = post.isFetching || false

    return (
      <main className="ui two column stackable has-header grid container">
        <div className="eight wide computer sixteen wide tablet column">
          <div className="ui row padding center">
            <h3><Translate content="manage.org_title" /></h3>
            <ReactCSSTransitionGroup
              transitionName="MessageTransition"
              transitionEnterTimeout={500}
              transitionLeaveTimeout={500}>
              {Message}
            </ReactCSSTransitionGroup>
            <form
              className={LoadingClass}
              onSubmit={this.handleSubmit}>
              {BindedMessage}
              <Form
                ref="form"
                type={ManageForm}
                options={this.state.options}
                value={this.state.value}
                onChange={this.handleChange} />
              <div className="ui hidden divider" />
              <button
                type="submit"
                className="ui orange labeled icon large button"
                disabled={this.state.submited}>
                <Translate content="password.submit" />
                <i className="add icon"></i>
              </button>
            </form>
          </div>
        </div>
        <div className="eight wide computer sixteen wide tablet column">
          <div className="row">
            <div className="ui center">
              <h2 className="ui orange label">
                <Translate content="manage.header" user={auth.user.email} />
              </h2>
            </div>
          </div>
          <div className="row">
            <Cards
              posts={post.posts}
              loadFunc={loadFunc}
              hasMore={post.hasMore}
              isFetching={loading}
              diff={120}
              threshold={200}
              defaultLocale={this.props.defaultLocale}
            />
            {loading && isEmpty(post.posts) && (
              <div className="ui segment basic has-header">
                <div className="ui active inverted dimmer">
                  <div className="ui indeterminate text loader">
                    <Translate content="wall.loading" />
                  </div>
                </div>
              </div>
            )}
            {!loading && isEmpty(post.posts) && (
              <div>
                <div className="ui hidden divider"></div>
                <div className="ui segment basic has-header center aligned">
                  <Translate content="post.nodata" />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    )
  }
}
