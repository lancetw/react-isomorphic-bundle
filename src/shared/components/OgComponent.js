import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { isEmpty } from 'lodash'
import { tongwenAutoStr } from 'shared/utils/tongwen'
import Nearby from './NearbyComponent'
import {
  toShortDate
} from 'shared/utils/date-utils'

export default class OgComponent extends React.Component {

  static propTypes = {
    og: PropTypes.object.isRequired,
    ognearby: PropTypes.object.isRequired,
    defaultLocale: PropTypes.string.isRequired
  }

  constructor (props) {
    super(props)
  }

  renderList = (posts, isFetching) => {
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
          { !isEmpty(posts) && posts.map(function (item, i) {
            return (
              <Link className="item" to={`/w/${item.id}`}>
                <div className="more">
                  <div className="ui orange horizontal label">
                    { toShortDate(item.startDate) }
                  </div>
                  <span>{ item.title }</span>
                </div>
              </Link>
            )})
          }
          { isEmpty(posts) && (
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
      <main className="ui one column centered stackable page grid">
        <div className="column">
          <div className="ui basic center aligned segment">
            <h1 className="ui large header">{ognearby.oginfo.ocname}</h1>
            <a href={`http://church.oursweb.net/church.php?pkey=${og.cid}`}
              target="_blank"
              className="ui blue large button">開啟華人教會機構名錄</a>
          </div>
        </div>
        <div className="two column centered row">
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
