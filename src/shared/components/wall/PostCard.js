import React, { PropTypes } from 'react'
import { BaseComponent } from 'shared/components'
import { Link } from 'react-router'
import { toShortDate, toYear } from 'shared/utils/date-utils'
import { PostPropArray } from 'shared/utils/forms'
import { at } from 'lodash'
import moment from 'moment'
import { fixLocaleName, originLocaleName } from 'shared/utils/locale-utils'
import counterpart from 'counterpart'
import { tongwenAutoStr } from 'shared/utils/tongwen'

const Translate = require('react-translate-component')

export default class PostCard extends BaseComponent {

  static propTypes = {
    data: PropTypes.object
  }

  constructor (props) {
    super(props)

    counterpart.onLocaleChange(::this.handleLocaleChange)
  }

  handleLocaleChange (newLocale) {
    if (process.env.BROWSER) {
      const locale = fixLocaleName(newLocale)
      moment.locale(locale)
      this.forceUpdate()
    }
  }

  renderCardProp (card) {
    return (
      <span>
        {at(PostPropArray(originLocaleName(counterpart.getLocale())), card.prop)}
      </span>
    )
  }

  renderLocationInfo (card) {
    if (card.place && card.lat && card.lng) {
      return (
        <a target="_blank" href={`http://maps.google.com/maps?z=18&q=${card.lat},${card.lng}`}>
          {tongwenAutoStr(card.place, this.getLocale())}
        </a>
      )
    } else if (card.ocname) {
      return (
        <span>{tongwenAutoStr(card.ocname, this.getLocale())}</span>
      )
    } else {
      return <Translate content="post.detail.nomap" />
    }
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
              <Link to={`/w/${card.id}`}>
                {tongwenAutoStr(card.title, this.getLocale())}
              </Link>
            </h2>
            <div className="ui orange top left attached label">
              {this.renderCardProp(card)}
            </div>
            {eventDate && (
              <div className="ui teal top right attached label">
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
              <span className="ui small white label">
                <Translate content="post.detail.end" /> {eventEndYear}
              </span>
            )}
            </div>
          </div>
          <div className="extra content">
            <div className="ui location">
              <span className="floated right like">
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
}
