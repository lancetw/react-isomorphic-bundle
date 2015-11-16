import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { toShortDate, toYear } from 'shared/utils/date-utils'
import { PostPropArray } from 'shared/utils/forms'
import { at } from 'lodash'
import { originLocaleName } from 'shared/utils/locale-utils'
import { tongwenAutoStr } from 'shared/utils/tongwen'
import shouldPureComponentUpdate from 'react-pure-render/function'
import connectI18n from 'shared/components/addon/connect-i18n'

const Translate = require('react-translate-component')

class PostCard extends Component {

  static propTypes = {
    data: PropTypes.object,
    defaultLocale: PropTypes.string.isRequired
  }

  constructor (props) {
    super(props)
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  renderCardProp (card) {
    return (
      <span>
        {at(PostPropArray(originLocaleName(this.props.defaultLocale)), card.prop)}
      </span>
    )
  }

  renderLocationInfo (card) {
    if (card.place && card.lat && card.lng) {
      return (
        <span>{tongwenAutoStr(card.place, this.props.defaultLocale)}</span>
      )
    } else if (card.ocname) {
      return (
        <span>{tongwenAutoStr(card.ocname, this.props.defaultLocale)}</span>
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
                {tongwenAutoStr(card.title, this.props.defaultLocale)}
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

export default connectI18n()(PostCard)
