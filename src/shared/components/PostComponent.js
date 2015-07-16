import React, { PropTypes } from 'react'
import { BaseComponent } from 'shared/components'
import { Form, PostForm, PostFormOptions } from 'shared/utils/forms'
import { isEmpty, clone } from 'lodash'
import classNames from 'classnames'
import moment from 'moment'
import counterpart from 'counterpart'
import ImageUpload from 'shared/components/addon/image-upload'
import { Tab, Tabs, TabList, TabPanel } from 'shared/components/addon/tabs'

const { CSSTransitionGroup } = React.addons

export default class Post extends BaseComponent {

  constructor (props) {
    super(props)
    this._bind(
      'handleSubmit',
      'validation',
      'handleChange'
    )

    const today = moment().format('YYYY-M-D').split('-')
    today[1] = today[1] - 1
    this.releaseTimeout = undefined
    this.state = {
      images: [],
      value: {
        type: '2',
        prop: '1',
        startDate: today,
        endDate: today,
        title: null,
        content: null
      },
      options: PostFormOptions(counterpart.getLocale()),
      submited: false,
      updated: false,
      locale: counterpart.getLocale()
    }

    counterpart.onLocaleChange(::this.handleLocaleChange)
  }

  static propTypes = {
    submit: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired,
    upload: PropTypes.object.isRequired
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  handleLocaleChange (newLocale) {
    this.setState({
      options: PostFormOptions(newLocale)
    })
  }

  handleChange (value) {
    this.setState({ value })
  }

  handleSelected (index, last) {}

  handleSubmit (evt) {
    evt.preventDefault()

    let value = this.refs.form.getValue()

    if (value) {
      let saved = clone(value)
      this.setState({ value: saved })
      this.setState({ submited: true })

      const upload = this.props.upload.filenames
      setTimeout(() => this.props.submit(value, upload), 1000)
    }
  }

  clearFormErrors () {
    let options = clone(this.state.options)
    options.fields = clone(options.fields)

    for (let key in options.fields) {
      if (options.fields.hasOwnProperty(key)) {
        options.fields[key] = clone(options.fields[key])
        if (options.fields[key].hasOwnProperty('hasError'))
          options.fields[key].hasError = false
      }
    }
    this.setState({ options: options })
  }

  validation (errors) {
    if (!isEmpty(errors)) {
      let options = clone(this.state.options)
      options.fields = clone(options.fields)

      errors.map(function (err) {
        if (err.code === 'invalid') {
          options.fields[err.field] = clone(options.fields[err.field])
          options.fields[err.field] = { hasError: true, error: err.message }
        } else {
          options.fields[err.path] = clone(options.fields[err.path])
          options.fields[err.path] = { hasError: true, error: err.message }
        }
      })
      this.setState({ submited: false })
      this.setState({ options: options })
    }
  }

  checkSubmited (content) {
    if (!isEmpty(content)) {
      this.setState({ submited: true })
      if (content.uid) this.setState({ updated: true, submited: true })
    }
  }

  componentWillReceiveProps (nextProps) {
    this.validation(nextProps.post.errors)
    this.checkSubmited(nextProps.post.content)
  }

  componentWillUnmount () {
    if (this.op)
      clearTimeout(this.releaseTimeout)
  }

  render () {
    if (process.env.BROWSER)
      if (!isEmpty(this.props.post.content))
        this.releaseTimeout =
          setTimeout(() => this.context.router.replaceWith('/wall/today'), 1000)

    const Translate = require('react-translate-component')

    let Loading = this.state.submited
      && !this.state.updated
      ? classNames('ui', 'form', 'loading')
      : classNames('ui', 'form')

    let Message = this.state.updated
      ? (
        <div>
          <div className="ui success message">
            <div className="header">
              <Translate content="post.created.title" />
            </div>
            <p><Translate content="post.created.content" /></p>
          </div>
          <div className="ui hidden divider"></div>
        </div> )
      : null

    return (
      <main className="ui two column stackable centered page grid">
        <div className="column">
          <CSSTransitionGroup transitionName="MessageTransition">
            {Message}
          </CSSTransitionGroup>
          <Tabs
            onSelect={this.handleSelected}
            selectedIndex={0}>
            <TabList>
              <Tab>
                <Translate content="post.tabs.title.basic" />
              </Tab>
              <Tab>
                <Translate content="post.tabs.title.upload" />
              </Tab>
            </TabList>
            <TabPanel index={0}>
              <form
                className={Loading}
                action="/posts/new"
                method="post"
                onSubmit={this.handleSubmit}>
                <Form
                  ref="form"
                  type={PostForm(counterpart.getLocale())}
                  options={this.state.options}
                  value={this.state.value}
                  onChange={this.handleChange}/>
                <div className="ui hidden divider" />
                <button
                  type="submit"
                  className="ui orange labeled icon large button"
                  disabled={this.state.submited}>
                  <Translate content="post.submit" />
                  <i className="add icon"></i>
                </button>
              </form>
            </TabPanel>
            <TabPanel index={1}>
              <p>
                <Translate content="post.tabs.msg.upload" />
              </p>
              <div className="ui three column grid center aligned">
                <ImageUpload index={0} />
                <ImageUpload index={1} />
                <ImageUpload index={2} />
              </div>
              <div className="ui orange center aligned segment">
                <Translate content="post.tabs.msg.limit" />
              </div>
            </TabPanel>
          </Tabs>
        </div>
      </main>
    )
  }
}

