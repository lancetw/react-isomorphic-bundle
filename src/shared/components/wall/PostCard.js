import React, { PropTypes } from 'react'
import { BaseComponent } from 'shared/components'
import { Link } from 'react-router'
import { toShortDate, toYear } from 'shared/utils/date-utils'
import { PostPropArray } from 'shared/utils/forms'
import { at } from 'lodash'
import counterpart from 'counterpart'
import moment from 'moment'
import { fixLocaleName, originLocaleName } from 'shared/utils/locale-utils'

export default class PostCard extends BaseComponent {

  static propTypes = {
    data: PropTypes.object,
    defaultLocale: PropTypes.string.isRequired
  }

  static defaultProps = {
    defaultLocale: 'en'
  }

  constructor (props) {
    super(props)

    counterpart.setLocale(props.defaultLocale)

    this.state = {
      locale: fixLocaleName(counterpart.getLocale())
    }

    counterpart.onLocaleChange(::this.handleLocaleChange)
  }

  getCardProp (index) {
    return at(PostPropArray(originLocaleName(this.state.locale)), index)
  }

  renderLocationInfo (card) {
    const Translate = require('react-translate-component')

    if (card.place) {
      if (card.lat && card.lng) {
        return (
          <a target="_blank" href={`http://maps.google.com/maps?z=18&q=${card.lat},${card.lng}`}>
            {card.place}
          </a>
        )
      } else {
        return (
          <span>{card.place}</span>
        )
      }
    }

    return <Translate content="post.detail.nomap" />
  }

  render () {
    const Translate = require('react-translate-component')

    const card = this.props.data

    const eventDate = (card.startDate === card.endDate)
    ? toShortDate(card.endDate)
    : toShortDate(card.startDate) + ' - ' + toShortDate(card.endDate)

    let eventEndYear =
      toYear(card.endDate) > toYear(new Date())
        ? toYear(card.endDate)
        : null

    const eventStartYear =
      toYear(card.startDate) < toYear(new Date())
        ? toYear(card.startDate)
        : null

    if (eventStartYear && toYear(card.endDate) === toYear(new Date())) {
      eventEndYear = '今年'
    }

    const cardProp = this.getCardProp(card.prop)

    return (
      <div>
        <div className="ui post card divider"></div>
        <div className="ui fluid orange post card">
          <div className="content">
            <h2 className="title">
              <Link to={`/wall/posts/${card.id}`}>{card.title}</Link>
            </h2>
            {eventDate && (
              <div className="ui orange huge right ribbon label">
                {eventDate}
              </div>
            )}
            <div className="date list">
            {eventStartYear && (
              <span className="ui medium grey label">
                {eventStartYear} { eventEndYear && `開始` }
              </span>
            )}
            {eventEndYear && (
              <span className="ui medium teal label">
                將結束於 {eventEndYear}
              </span>
            )}
            </div>
          </div>
          <div className="extra content">
            <div className="ui location">
              <span className="right floated like">
                <i className="like icon"></i>
                  {this.renderLocationInfo(card)}
              </span>
            </div>
          </div>
        </div>
        <div className="ui post card divider"></div>
      </div>
    )
  }

  handleLocaleChange (newLocale) {
    if (process.env.BROWSER) {
      const locale = fixLocaleName(newLocale)
      moment.locale(locale)
      this.setState({ locale })
    }
  }
}
