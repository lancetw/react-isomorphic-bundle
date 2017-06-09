import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { isEmpty } from 'lodash'
import { tongwenAutoStr } from 'shared/utils/tongwen'
import Nearby from './NearbyComponent'
import {
  toShortDate
} from 'shared/utils/date-utils'

export default class OgComponent extends Component {

  static propTypes = {
    og: PropTypes.object.isRequired,
    ognearby: PropTypes.object.isRequired,
    defaultLocale: PropTypes.string.isRequired
  }

  constructor (props) {
    super(props)
  }

  renderList = (posts, isFetching) => {
    const Translate = require('react-translate-component')
    return (
      <div className="ui fluid detail card">
        {isFetching &&
        <div className="ui segment basic has-header">
          <div className="ui active inverted dimmer">
            <div className="ui large loader"></div>
          </div>
        </div>
        }
        <div className="ui divided selection animated list content">
          { !isFetching && !isEmpty(posts) && posts.map(function (item, i) {
            const eventDate = (item.startDate === item.endDate)
            ? toShortDate(item.endDate)
            : toShortDate(item.startDate) + ' ~'
            return (
              <Link key={item.id} className="item" to={`/w/${item.id}`}>
                <div className="more">
                  <div className="ui orange horizontal label">
                    { eventDate }
                  </div>
                  { item.distance >= 0 && (
                    <div className="ui teal horizontal label">
                      { item.distance >= 1
                        && <Translate content="geoloc.distance.basic.km" dist={item.distance.toFixed(1)}/> }
                      { item.distance < 1 && item.distance >= 0.01
                        && <Translate content="geoloc.distance.basic.m" dist={(item.distance * 1000).toFixed(1)}/> }
                      { item.distance < 0.01
                        && <Translate content="geoloc.distance.basic.here" /> }
                    </div>
                  )}
                  <span>{ item.title }</span>
                </div>
              </Link>
            )})
          }
          { !isFetching && isEmpty(posts) && (
            <span>目前沒有相關資訊</span>
          )}
        </div>
      </div>
    )
  }

  render () {
    const Translate = require('react-translate-component')
    const { og, ognearby } = this.props
    return (
      <main className="ui one column stackable page grid">
        <div className="column">
          <div className="ui basic center aligned segment">
            <h1 className="ui large header">{ognearby.oginfo.ocname}</h1>
            <a href={`http://church.oursweb.net/church.php?pkey=${og.cid}`}
              target="_blank"
              className="ui blue large button">開啟華人教會機構名錄</a>
          </div>
        </div>
        <div className="two column row">
          <div className="column">
            <h2 className="ui small header">最新張貼的佈告</h2>
            {this.renderList(og.data, og.isFetching)}
          </div>
          <div className="column">
            <h2 className="ui small header">附近發生的活動</h2>
            {this.renderList(
              ognearby.data, ognearby.isFetching)}
          </div>
        </div>
      </main>
    )
  }
}
