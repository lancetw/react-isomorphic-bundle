import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import {
  Form,
  PostForm,
  PostFormOptions,
  RegForm,
  RegFormOptions
} from 'shared/utils/forms'
import { each, isEmpty, clone } from 'lodash'
import classNames from 'classnames'
import moment from 'moment'
import ImageUpload from 'shared/components/addon/image-upload'
import GMap from 'shared/components/addon/maps/gmap'
import {
  Tab,
  Tabs,
  TabList,
  TabPanel
} from 'shared/components/addon/tabs'
import { toDate } from 'shared/utils/date-utils'
import { getFileExt } from 'shared/utils/file-utils'
import { runGeoLoc } from 'shared/utils/geoloc-utils'
import $ from 'jquery'
import { createHistory } from 'history'
import queryString from 'query-string'

let unlisten
let history
if (process.env.BROWSER) {
  history = createHistory()
}

export default class Post extends Component {

  static propTypes = {
    submit: PropTypes.func.isRequired,
    modify: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired,
    setPin: PropTypes.func.isRequired,
    setImageFileName: PropTypes.func.isRequired,
    setImagePreview: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    post: PropTypes.object.isRequired,
    upload: PropTypes.object.isRequired,
    map: PropTypes.object.isRequired,
    params: PropTypes.object,
    defaultLocale: PropTypes.string.isRequired,
    disableSubmit: PropTypes.bool.isRequired,
    options: PropTypes.object.isRequired,
    regOptions: PropTypes.object.isRequired,
    formType: PropTypes.func.isRequired,
    regFormType: PropTypes.func.isRequired,
    _T: PropTypes.func.isRequired
  }

  static contextTypes = {
    history: PropTypes.object.isRequired
  }

  static defaultProps = {
    disableSubmit: false
  }

  constructor (props) {
    super(props)

    this.releaseTimeout = undefined
    this.releaseTimeout1 = undefined
    const today = this.dateToArray(moment().format('YYYY-M-D'))
    this.state = {
      formInited: false,
      uploadInited: false,
      images: [],
      value: {
        type: '2',
        prop: '1',
        startDate: today,
        endDate: today,
        title: null,
        content: null
      },
      regValue: {
        openDate: today,
        closeDate: today
      },
      formType: props.formType,
      regFormType: props.regFormType,
      options: props.options,
      regOptions: props.regOptions,
      submited: false,
      updated: false,
      placeError: false,
      latlngError: false,
      disableSubmit: props.disableSubmit,
      ocname: null
    }
  }

  componentWillMount () {
    const { id } = this.props.params
    if (id) {
      this.initForm(this.props.post.detail)
    }
    if (process.env.BROWSER) {
      let tab
      tab = queryString.parse(window.location.search).tab

      this.setState({ tabIndex: +tab || 0 })

      unlisten = history.listen((location) => {
        if (this.state.inited) {
          tab = queryString.parse(location.search).tab
          this.setState({ tabIndex: +tab })
        } else {
          this.setState({ inited: true })
        }
      })
    }
  }

  componentWillReceiveProps (nextProps) {
    if (!this.state.formInited) {
      const { id } = this.props.params
      if (id && this.initForm(nextProps.post.detail)) {
        this.setState({ formInited: true })
      }
    }

    this.validation(nextProps.post.errors)
    this.checkSubmited(nextProps.post.content)

    if (this.refs.lat) {
      ReactDOM.findDOMNode(this.refs.lat).value = nextProps.map.lat
    }
    if (this.refs.lng) {
      ReactDOM.findDOMNode(this.refs.lng).value = nextProps.map.lng
    }

    this.setState({
      options: nextProps.options,
      regOptions: nextProps.regOptions,
      formType: nextProps.formType,
      regFormType: nextProps.regFormType
    })
  }

  componentDidUpdate () {
    if (!isEmpty(this.props.post.content)) {
      this.releaseTimeout = setTimeout(() => {
        this.context.history.replaceState({}, '/w')
      }, 1000)
    }
  }

  componentWillUnmount () {
    typeof unlisten === 'function' && unlisten()
    if (this.op) {
      clearTimeout(this.releaseTimeout)
      clearTimeout(this.releaseTimeout1)
    }
  }

  setHistory = (index) => {
    const pathname = window.location.pathname
    history.pushState({ the: 'state' }, pathname + '?tab=' + index)
    this.setState({ tabIndex: +index })
  }

  showPosition (position) {
    const map = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    }

    this.props.setPin(map)
  }

  handleMapSubmit = (event) => {
    event.preventDefault()
    const map = {
      place: ReactDOM.findDOMNode(this.refs.place).value.trim(),
      lat: parseFloat(ReactDOM.findDOMNode(this.refs.lat).value.trim()),
      lng: parseFloat(ReactDOM.findDOMNode(this.refs.lng).value.trim())
    }

    if (!map.lat || !map.lng || !map.place) {
      if (!map.lat || !map.lng) {
        this.setState({ latlngError: true })
      }
      if (!map.place) {
        this.setState({ placeError: true })
      }

      return
    }

    this.props.setPin(map)
    this.setState({ latlngError: false })
    this.setState({ placeError: false })
  }

  handleChange = (value, path) => {
    if (path[0] === 'startDate') {
      const newValue = clone(value)
      const startDate = this.refs.form.getComponent(path).getValue()
      const endDate = this.refs.form.getComponent(['endDate']).getValue()
      newValue.endDate = newValue.startDate
      this.setState({ value: newValue })
    } else {
      this.setState({ value })
    }
  }

  handleOcnameChange = (event) => {
    this.setState({ ocname: event.target.value })
  }

  handleRegChange = (regValue, path) => {
    if (path[0] === 'openDate') {
      const newValue = clone(regValue)
      const openDate = this.refs.regForm.getComponent(path).getValue()
      const closeDate = this.refs.regForm.getComponent(['closeDate']).getValue()
      newValue.closeDate = newValue.openDate
      this.setState({ regValue: newValue })
    } else {
      this.refs.regForm.validate()
      this.setState({ regValue })
    }
  }

  dateToArray (date) {
    const _date = date.split('-')
    _date[1] = _date[1] - 1
    return _date
  }

  handleSelected = (index) => {
    this.setHistory(index)

    if (index === 2 && !this.state.uploadInited) {
      const { detail } = this.props.post
      const { user } = this.props.auth

      const files = typeof detail.file !== 'undefined'
      ? JSON.parse(detail.file)
      : []

      let src
      let name
      each(files, (filename, _index) => {
        if (getFileExt(filename.toLowerCase()) === 'pdf') {
          name = 'pdf.png'
          src = user.aud + '/images/' + name
        } else {
          name = filename
          src = user.aud + '/uploads/' + name
        }

        this.props.setImagePreview(src, _index)
      })

      this.setState({ uploadInited: true })
    }
  }

  handleMapChange = (event) => {
    const { center } = event
    if (this.refs.lat) {
      ReactDOM.findDOMNode(this.refs.lat).value = center.lat
    }
    if (this.refs.lng) {
      ReactDOM.findDOMNode(this.refs.lng).value = center.lng
    }
  }

  handleSearch = (event) => {
    event.preventDefault()
    const { _T } = this.props
    const address = ReactDOM.findDOMNode(this.refs.place).value.trim()
    if (!address || address === _T('post.map.my')) {
      runGeoLoc().then(this.showPosition.bind(this))
    } else {
      this.props.search(address)
    }
  }

  handleGeo = (event) => {
    event.preventDefault()
    runGeoLoc().then(this.showPosition.bind(this))
  }

  handleSubmit = (evt) => {
    evt.preventDefault()

    const value = this.refs.form.getValue()
    if (value) {
      const saved = clone(value)
      this.setState({ value: saved })
      this.setState({ submited: true })

      const upload = this.props.upload.filenames
      let map
      if (this.props.map.place) {
        map = {
          place: this.props.map.place,
          lat: this.props.map.lat,
          lng: this.props.map.lng
        }
      }

      const regValue = this.state.regValue

      const ocname = ReactDOM.findDOMNode(this.refs.ocname).value

      this.releaseTimeout1 = setTimeout(() => {
        const { id } = this.props.params
        if (id) {
          this.props.modify({ id, value, regValue, upload, map, ocname })
        } else {
          this.props.submit({ value, regValue, upload, map, ocname })
        }
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

  validation = (errors) => {
    if (typeof errors !== 'undefined' && !isEmpty(errors)) {
      this.setState({ disableSubmit: false })

      const options = clone(this.state.options)
      options.fields = clone(options.fields)
      const regOptions = clone(this.state.regOptions)
      regOptions.fields = clone(regOptions.fields)

      if (typeof errors.map !== 'undefined') {
        errors.map(function (err) {
          if (options.fields[err.field] !== 'undefined') {
            if (err.code === 'invalid') {
              options.fields[err.field] = clone(options.fields[err.field])
              options.fields[err.field] = {
                hasError: true, error: err.message
              }
            } else {
              options.fields[err.path] = clone(options.fields[err.path])
              options.fields[err.path] = {
                hasError: true, error: err.message
              }
            }
          }

          if (regOptions.fields[err.field] !== 'undefined') {
            if (err.code === 'invalid') {
              regOptions.fields[err.field] = clone(regOptions.fields[err.field])
              regOptions.fields[err.field] = {
                hasError: true, error: err.message
              }
            } else {
              regOptions.fields[err.path] = clone(regOptions.fields[err.path])
              regOptions.fields[err.path] = {
                hasError: true, error: err.message
              }
            }
          }
        })
      }

      this.setState({
        options,
        regOptions,
        submited: false,
        disableSubmit: true
      })
    }
  }

  checkSubmited (content) {
    if (!isEmpty(content)) {
      this.setState({ submited: true })
      if (content.uid) this.setState({ updated: true, submited: true })
    }
  }

  initForm (detail) {
    if (!isEmpty(detail)) {
      const startDate = this.dateToArray(toDate(detail.startDate))
      const endDate = this.dateToArray(toDate(detail.endDate))
      const openDate = this.dateToArray(toDate(detail.openDate))
      const closeDate = this.dateToArray(toDate(detail.closeDate))
      this.setState({
        value: {
          type: detail.type.toString(),
          prop: detail.prop.toString(),
          startDate: startDate,
          endDate: endDate,
          title: detail.title,
          content: detail.content
        },
        regValue: {
          openDate: openDate,
          closeDate: closeDate,
          url: isEmpty(detail.url) ? undefined : detail.url
        },
        ocname: detail.cid
      })

      const map = {
        lat: detail.lat,
        lng: detail.lng,
        place: detail.ocname || detail.place
      }
      this.props.setPin(map)

      return true
    }
    return false
  }

  static defaultPropTypes = {
    disableSubmit: false
  }

  renderTips () {
    const Translate = require('react-translate-component')
    return (
      <div className="ui small warning message">
        <div className="header">
          <Translate content="post.tips.title" />
        </div>
        <p><Translate content="post.tips.content" /></p>
      </div>
    )
  }

  render () {
    const Translate = require('react-translate-component')

    const submitClass = classNames(
      'ui',
      'fluid',
      'orange',
      'labeled',
      'icon',
      'large',
      'button',
      { 'disabled': this.props.disableSubmit }
    )

    const advancedClass = classNames(
      'ui',
      'orange',
      'message',
      { 'hidden': !this.props.auth.user.advanced }
    )

    const Loading = classNames(
      'ui',
      'form',
      { 'loading': this.state.submited && !this.state.updated }
    )

    const PlaceInput = classNames(
      'ui',
      'fluid',
      'action',
      'input',
      { 'error': !!this.state.placeError }
    )

    const LatLngInput = classNames(
      'ui',
      'fluid',
      'labeled',
      'input',
      { 'error': !!this.state.latlngError }
    )

    const Message = this.state.updated
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

    const UploadErrorMessage = !isEmpty(this.props.upload.errorMessages)
    ? (
      <div>
        <div className="ui error message">
          <div className="header">
            <Translate content="post.upload.error" />
          </div>
        </div>
        <div className="ui hidden divider"></div>
      </div> )
    : null

    return (
      <main className="ui two column stackable has-header grid container">
        <div className="column">
          <GMap
            ref="gmap"
            {...this.props.map}
            defaultLocale={this.props.defaultLocale}
            onChange={this.handleMapChange}
          />
        </div>
        <div className="column">
          <Tabs
            ref="tabs"
            onSelect={this.handleSelected}
            selectedIndex={ this.state.tabIndex || 0}>
            <TabList selectedIndex={ this.state.tabIndex || 0}>
              <Tab>
                <Translate content="post.tabs.title.basic" />
              </Tab>
              <Tab>
                <Translate content="post.tabs.title.enroll" />
              </Tab>
              <Tab>
                <Translate content="post.tabs.title.upload" />
              </Tab>
              <Tab>
                <Translate content="post.tabs.title.map" />
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
                  type={this.state.formType}
                  options={this.state.options}
                  value={this.state.value}
                  onChange={this.handleChange}/>
                <div className={advancedClass}>
                  <input
                    type="text"
                    placeholder={this.props._T('post.advanced.ocname.text')}
                    ref="ocname"
                    onChange={this.handleOcnameChange}
                    value={this.state.ocname}
                    />
                </div>
                <div className="ui hidden divider" />
                <button
                  type="submit"
                  className={submitClass}
                  disabled={this.state.submited}>
                  <Translate content="post.submit" />
                  <i className="add icon"></i>
                </button>
              </form>
            </TabPanel>
            <TabPanel index={1}>
              {this.renderTips()}
              <form>
                <Form
                  ref="regForm"
                  type={this.state.regFormType}
                  options={this.state.regOptions}
                  value={this.state.regValue}
                  onChange={this.handleRegChange}/>
              </form>
              <div className="ui orange center aligned segment">
                <Translate content="post.tabs.msg.urltips" />
              </div>
            </TabPanel>
            <TabPanel index={2}>
              {this.renderTips()}
              <ReactCSSTransitionGroup
                transitionName="MessageTransition"
                transitionEnterTimeout={500}
                transitionLeaveTimeout={500}>
                {UploadErrorMessage}
              </ReactCSSTransitionGroup>
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
            <TabPanel index={3}>
              {this.renderTips()}
              <form
                onSubmit={this.handleMapSubmit}>
                <div className={PlaceInput}>
                  <input
                    type="text"
                    placeholder={this.props._T('post.map.my')}
                    ref="place"
                    defaultValue={
                      this.props.map.place
                      || ''
                    } />
                  <button
                    className="ui green button"
                    onClick={this.handleSearch}>
                    <Translate content="post.map.search" />
                  </button>
                </div>
                <div className="ui pointing label visible">
                  <i><Translate content="post.map.tips" /></i>
                </div>
                <div className="ui hidden divider" />
                <div className={LatLngInput}>
                  <div className="ui label">
                    <Translate content="post.map.lng" />
                  </div>
                  <input type="text"
                    placeholder="longitude"
                    ref="lng"
                    defaultValue={this.props.map.lng} />
                </div>
                <div className="ui hidden divider" />
                <div className={LatLngInput}>
                  <div className="ui label">
                    <Translate content="post.map.lat" />
                  </div>
                  <input
                    type="text"
                    placeholder="latitude"
                    ref="lat"
                    defaultValue={this.props.map.lat} />
                </div>
                <div className="ui hidden divider" />
                <div className="ui relaxed list">
                  <div className="item">
                    <div className="left floated content">
                      <button
                        className="ui circular yellow large icon button"
                        onClick={this.handleGeo}>
                        <i className="icon large map"></i>
                      </button>
                    </div>
                    <div className="right floated content">
                      <button
                        className="ui large orange button">
                        <Translate content="post.map.update" />
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </TabPanel>
          </Tabs>
        </div>

      </main>
    )
  }
}
