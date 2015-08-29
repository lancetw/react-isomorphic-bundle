import React, { PropTypes } from 'react'
import { BaseComponent } from 'shared/components'
import { Link } from 'react-router'
import { toShortDate, toYear } from 'shared/utils/date-utils'
import { PostPropArray } from 'shared/utils/forms'
import { at } from 'lodash'
import moment from 'moment'
import { fixLocaleName, originLocaleName } from 'shared/utils/locale-utils'
import counterpart from 'counterpart'

const Translate = require('react-translate-component')

export default class PostCard extends BaseComponent {

  static propTypes = {
    data: PropTypes.object
  }

  constructor (props) {
    super(props)

    counterpart.onLocaleChange(::this.handleLocaleChange)
  }

  renderCardProp (card) {
    return (
      <span>
        {at(PostPropArray(originLocaleName(this.getLocale())), card.prop)}
      </span>
    )
  }

  renderLocationInfo (card) {
    if (card.place && card.lat && card.lng) {
      return (
        <a target="_blank" href={`http://maps.google.com/maps?z=18&q=${card.lat},${card.lng}`}>
          {card.place}
        </a>
      )
    } else {
      return (
        <span>{card.ocname}</span>
      )
    }
    return <Translate content="post.detail.nomap" />
  }

  render () {
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
      eventEndYear = <Translate content="post.detail.this_year" />
    }

    return (
      <div>
        <div className="ui post card divider"></div>
        <div className="ui fluid post card">
          <div className="content">
            <h2 className="title">
              <Link to={`/wall/posts/${card.id}`}>{card.title}</Link>
            </h2>
            {eventDate && (
              <div className="ui orange large right ribbon label">
                {eventDate}
              </div>
            )}
            <div className="date list">
            {eventStartYear && (
              <span className="ui small grey label">
                {eventStartYear}
                { eventEndYear
                  && <Translate content="post.detail.start" /> }
              </span>
            )}
            {eventEndYear && (
              <span className="ui small teal label">
                <Translate content="post.detail.end" /> {eventEndYear}
              </span>
            )}
            </div>
          </div>
          <div className="extra content">
            <div className="left floated ui tag label">
              {this.renderCardProp(card)}
            </div>
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
    }
  }
}
