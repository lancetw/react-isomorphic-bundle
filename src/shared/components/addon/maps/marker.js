
import React, { PropTypes, Component } from 'react'
import shouldPureComponentUpdate from 'react-pure-render/function'
import classNames from 'classnames'
import { Link } from 'react-router'
import { toShortDate } from 'shared/utils/date-utils'

export default class Marker extends Component {

  static propTypes = {
    key: PropTypes.any,
    hover: PropTypes.bool.isRequired,
    pulse: PropTypes.bool.isRequired,
    isOpen: PropTypes.bool.isRequired,
    data: PropTypes.object.isRequired,
    handleCloseClick: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  render () {
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
      { 'pulse': this.props.pulse ? true : false },
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

    const eventDate = (data.start_date === data.end_date)
    ? toShortDate(data.end_date)
    : toShortDate(data.start_date) + ' - ' + toShortDate(data.end_date)

    return (
      <div key={this.props.key}>
        <div>
          <div className={pinClasses}></div>
          <div className={pulseClasses}></div>
        </div>
        <div className={tooltipsClasses}>
          <div className="ui card popupbox">
            <div className="content">
              <div className="ui center floated">
              {eventDate && (
                <span className="ui attached top orange label">
                  {eventDate}
                </span>)
              }
              </div>
            </div>
            <div className="content">
              <div className="header">{data.title}</div>
            </div>
            <div className="content">
              <i className="ui orange icon large compass"></i>
              { data.distance >= 1
                && `距離我約為 ${data.distance.toFixed(3)} 公里`}
              { data.distance < 1
                && `距離我約為 ${(data.distance * 1000).toFixed(2)} 公尺`}
            </div>
            <div className={actionClasses}>
              <div className="ui two buttons">
                <Link
                  to={`/w/p/${data.id}`}
                  target="_blank"
                  className="ui basic green button">
                  詳細佈告
                </Link>
                <a onClick={this.props.handleCloseClick}
                  className="ui basic red button">
                  關閉
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
