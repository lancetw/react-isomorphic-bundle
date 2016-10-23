import React, { Component, PropTypes } from 'react'
import shouldPureComponentUpdate from 'react-pure-render/function'
import classNames from 'classnames'
import { toShortDate } from 'shared/utils/date-utils'
import { tongwenAutoStr } from 'shared/utils/tongwen'

export default class Marker extends Component {

  static propTypes = {
    hover: PropTypes.bool.isRequired,
    pulse: PropTypes.bool.isRequired,
    isOpen: PropTypes.bool.isRequired,
    data: PropTypes.object.isRequired,
    handleGoClick: PropTypes.func,
    handleCloseClick: PropTypes.func,
    handleTouchStart: PropTypes.func,
    defaultLocale: PropTypes.string.isRequired
  }

  constructor (props) {
    super(props)
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  onTouchStart = (key, childProps, event) => {
    if (this.props.handleTouchStart) {
      return this.props.handleTouchStart(key, childProps)
    }
  }

  render () {
    const Translate = require('react-translate-component')

    const pinClasses = classNames(
      'pin',
      'bounce',
      'green',
      { 'hover': this.props.hover },
      { 'open': this.props.isOpen }
    )

    const tooltipsClasses = classNames(
      'ui',
      'box',
      'tooltips',
      { 'hover': this.props.hover },
      { 'open': this.props.isOpen }
    )

    const pulseClasses = classNames(
      { 'xpulse': this.props.pulse ? true : false },
      'green',
      { 'hover': this.props.hover },
      { 'open': this.props.isOpen }
    )

    const actionClasses = classNames(
      'extra',
      'content',
      { 'hidden': !this.props.isOpen }
    )

    const { data } = this.props
    const eventDate = (data.startDate === data.endDate)
    ? toShortDate(data.endDate)
    : toShortDate(data.startDate) + ' - ' + toShortDate(data.endDate)

    return (
      <div
        onTouchStart={this.onTouchStart.bind(null, data.id, data)}>
        <div>
          <div className={pinClasses}></div>
          <div className={pulseClasses}></div>
        </div>
        <div className={tooltipsClasses}>
          <div className="ui card popupbox">
            <div className="content">
              <div className="ui right aligned">
              {eventDate && (
                <span className="ui attached top orange label">
                  {eventDate}
                </span>)
              }
              </div>
            </div>
            <div className="content">
              <div className="header">
              {tongwenAutoStr(data.title, this.props.defaultLocale)}
              </div>
            </div>
            <div className="content">
              <i className="ui orange icon large compass"></i>
              { data.distance >= 1
                && <Translate content="geoloc.distance.km" dist={data.distance.toFixed(3)}/> }
              { data.distance < 1 && data.distance >= 0.01
                && <Translate content="geoloc.distance.m" dist={(data.distance * 1000).toFixed(2)}/> }
              { data.distance < 0.01
                && <Translate content="geoloc.distance.here" /> }
            </div>
            <div className={actionClasses}>
              <div className="ui two buttons">
                <a onClick={this.props.handleGoClick} className="ui basic green button">
                  <Translate content="geoloc.button.go" />
                </a>
                <a onClick={this.props.handleCloseClick} className="ui basic red button">
                  <Translate content="geoloc.button.close" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
