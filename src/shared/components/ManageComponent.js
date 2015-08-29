import React, { PropTypes } from 'react'
import { BaseComponent } from 'shared/components'
import Cards from 'shared/components/wall/PostCards'
import {
  Form,
  ManageForm,
  ManageFormOptions
} from 'shared/utils/forms'
import { isEmpty, clone } from 'lodash'
import classNames from 'classnames'
import counterpart from 'counterpart'
const { CSSTransitionGroup } = React.addons

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
      if (this.initForm(nextProps.user.info)) {
        this.setState({ formInited: true })
      }
    }

    this.validation(nextProps.user.errors)
    this.checkSubmited(nextProps.user._info)
  }

  componentWillUnmount () {
    if (this.op) {
      clearTimeout(this.releaseTimeout)
    }
  }

  render () {
    const Translate = require('react-translate-component')

    const LoadingClass = classNames(
      'ui',
      'orange',
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

    const { post, auth, loadFunc } = this.props
    const loading = !!post.isFetching

    return (
      <main className="ui two column stackable has-header grid container">
        <div className="column">
          <div className="row padding">
            <h2><Translate content="manage.org_title" /></h2>
            <CSSTransitionGroup transitionName="MessageTransition">
              {Message}
            </CSSTransitionGroup>
            <form
              className={LoadingClass}
              onSubmit={this.handleSubmit}>
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
        <div className="column">
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
              diff={126}
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

      this.releaseTimeout =
        setTimeout(() => this.props.changeInfo(value), 1000)
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
}
