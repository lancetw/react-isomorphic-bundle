import React, { PropTypes } from 'react'
import { BaseComponent } from 'shared/components'
import {
  Form,
  PostForm,
  PostFormOptions,
  RegForm,
  RegFormOptions
} from 'shared/utils/forms'
import { isEmpty, clone } from 'lodash'
import classNames from 'classnames'
import moment from 'moment'
import counterpart from 'counterpart'
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
import { each } from 'lodash'
import $ from 'jquery'
import { createHistory } from 'history'
import queryString from 'query-string'

let unlisten
let history
if (process.env.BROWSER) {
  history = createHistory()
}

const { CSSTransitionGroup } = React.addons

export default class Post extends BaseComponent {

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
    disableSubmit: PropTypes.bool.isRequired
  }

  static contextTypes = {
    history: PropTypes.object.isRequired
  }

  constructor (props, context) {
    super(props, context)
    this._bind(
      'handleSubmit',
      'validation',
      'handleChange',
      'handleRegChange'
    )
    this.releaseTimeout = undefined
    const today = this.dateToArray(moment().format('YYYY-M-D'))

    counterpart.setLocale(props.defaultLocale)
    const locale = counterpart.getLocale()

    let tab
    if (process.env.BROWSER) {
      tab = queryString.parse(window.location.search).tab
    }

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
      formType: PostForm(locale),
      regFormType: RegForm(locale),
      options: PostFormOptions(locale),
      regOptions: RegFormOptions(locale),
      submited: false,
      updated: false,
      locale: locale,
      placeError: false,
      latlngError: false,
      disableSubmit: props.disableSubmit,
      tabIndex: +tab || 0
    }

    counterpart.onLocaleChange(::this.handleLocaleChange)

    if (process.env.BROWSER) {
      unlisten = history.listen((location) => {
        tab = queryString.parse(location.search).tab
        this.setState({ tabIndex: +tab })
      })
    }
  }

  componentWillReceiveProps (nextProps) {
    if (!this.state.formInited) {
      if (this.initForm(nextProps.post.detail)) {
        this.setState({ formInited: true })
      }
    }

    this.validation(nextProps.post.errors)
    this.checkSubmited(nextProps.post.content)

    if (this.refs.lat) {
      React.findDOMNode(this.refs.lat).value = nextProps.map.lat
    }
    if (this.refs.lng) {
      React.findDOMNode(this.refs.lng).value = nextProps.map.lng
    }
  }

  componentWillUnmount () {
    if (process.env.BROWSER) {
      typeof unlisten === 'function' && unlisten()
    }
    if (this.op) {
      clearTimeout(this.releaseTimeout)
    }
  }

  setHistory (index) {
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

  showError (error) {
    switch (error.code) {
    case error.PERMISSION_DENIED:
      sweetAlert('User denied the request for Geolocation.')
      break
    case error.POSITION_UNAVAILABLE:
      sweetAlert('Location information is unavailable.')
      break
    case error.TIMEOUT:
      sweetAlert('The request to get user location timed out.')
      break
    case error.UNKNOWN_ERROR:
      sweetAlert('An unknown error occurred.')
      break
    default:
      break
    }
  }

  handleMapSubmit (event) {
    event.preventDefault()
    const map = {
      place: React.findDOMNode(this.refs.place).value.trim(),
      lat: parseFloat(React.findDOMNode(this.refs.lat).value.trim()),
      lng: parseFloat(React.findDOMNode(this.refs.lng).value.trim())
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

  handleChange (value) {
    this.setState({ value })
  }

  handleRegChange (regValue) {
    this.refs.regForm.getValue()
    this.setState({ regValue })
  }

  dateToArray (date) {
    const _date = date.split('-')
    _date[1] = _date[1] - 1
    return _date
  }

  handleSelected (index) {
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

  handleLocaleChange (newLocale) {
    if (process.env.BROWSER) {
      this.setState({
        options: PostFormOptions(newLocale),
        regOptions: RegFormOptions(newLocale),
        formType: PostForm(newLocale),
        regFormType: RegForm(newLocale)
      })
    }
  }

  handleBoundsChange (event) {
    if (this.refs.lat) {
      React.findDOMNode(this.refs.lat).value = event.center[0]
    }
    if (this.refs.lng) {
      React.findDOMNode(this.refs.lng).value = event.center[1]
    }
  }

  handleSearch (event) {
    event.preventDefault()
    const address = React.findDOMNode(this.refs.place).value.trim()
    if (!address || address === counterpart('post.map.my')) {
      this.runGeoLoc()
    } else {
      this.props.search(address)
    }
  }

  runGeoLoc () {
    if (navigator.geolocation) {
      const optn = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
      navigator.geolocation
        .getCurrentPosition(this.showPosition.bind(this), this.showError, optn)
    } else {
      sweetAlert('Geolocation is not supported in your browser')
    }
  }

  handleGeo (event) {
    event.preventDefault()
    this.runGeoLoc()
  }

  handleSubmit (evt) {
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

      setTimeout(() => {
        const { id } = this.props.params
        if (id) {
          this.props.modify({ id, value, regValue, upload, map })
        } else {
          this.props.submit({ value, regValue, upload, map })
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

  validation (errors) {
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
        }
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
    if (process.env.BROWSER) {
      if (!isEmpty(this.props.post.content)) {
        this.releaseTimeout = setTimeout(() => {
          this.context.history.replaceState({}, '/w')
        }, 1000)
      }
    }

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
            onBoundsChange={::this.handleBoundsChange}
          />
        </div>
        <div className="column">
          <Tabs
            ref="tabs"
            onSelect={::this.handleSelected}
            selectedIndex={ this.state.tabIndex || 0}>
            <TabList selectedIndex={ this.state.tabIndex || 0}>
              <Tab>
                <Translate content="post.tabs.title.basic" />
              </Tab>
              <Tab>
                <Translate content="post.tabs.title.advanced" />
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
              <CSSTransitionGroup transitionName="MessageTransition">
                {UploadErrorMessage}
              </CSSTransitionGroup>
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
                onSubmit={::this.handleMapSubmit}>
                <div className={PlaceInput}>
                  <input
                    type="text"
                    placeholder={counterpart('post.map.my')}
                    ref="place"
                    defaultValue={
                      this.props.map.place
                      || ''
                    } />
                  <button
                    className="ui green button"
                    onClick={::this.handleSearch}>
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
                <div className="ui list">
                  <div className="item">
                    <div className="left floated content">
                      <button
                        className="ui circular yellow large icon button"
                        onClick={::this.handleGeo}>
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

