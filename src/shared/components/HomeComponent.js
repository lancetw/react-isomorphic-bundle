import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { isEmpty, at } from 'lodash'
import { toShortDate } from 'shared/utils/date-utils'
import { PostPropArray } from 'shared/utils/forms'
import { originLocaleName } from 'shared/utils/locale-utils'
import { tongwenAutoStr } from 'shared/utils/tongwen'
import CpropList from './CpropList'

export default class HomeComponent extends Component {

  static propTypes = {
    post: PropTypes.object.isRequired,
    defaultLocale: PropTypes.string.isRequired
  }

  constructor (props) {
    super(props)
  }

  renderNews (posts) {
    if (!isEmpty(posts)) {
      return posts.map(function (post) {
        return this.renderItem(post)
      }.bind(this))
    } else {
      return <div></div>
    }
  }

  renderItem (post) {
    const Translate = require('react-translate-component')
    const { defaultLocale } = this.props

    const eventDate = (post.startDate === post.endDate)
    ? toShortDate(post.endDate)
    : toShortDate(post.startDate) + ' - ' + toShortDate(post.endDate)

    return (
      <div key={post.id} className="ui orange icon message">
        <div className="content">
          <h3>
            <Link to={`/w/${post.id}`}>
              <span className="ui orange">
                [{at(PostPropArray(originLocaleName(defaultLocale)), post.prop)}]
              </span>
              <span> </span>
              {tongwenAutoStr(post.ocname, defaultLocale)
                || <Translate content="news.unnamed" />}
            </Link>
          </h3>
          <div className="header">
            {tongwenAutoStr(post.title, defaultLocale)}
          </div>
        </div>
      </div>
    )
  }

  render () {
    const Translate = require('react-translate-component')
    const { posts } = this.props.post
    const loading = this.props.post.isFetching

    return (
      <main className="ui has-header two column grid centered container">
        <div className="sixteen wide tablet twelve wide computer column">
          <div className="ui column grid page">
            <div className="tablet computer only row">
              <Link to="/w/cal" className="ui orange fluid large button">
                <Translate content="home.browse" />
              </Link>
            </div>
            <div className="mobile only row">
              <Link to="/w/today" className="ui orange fluid large button">
                <Translate content="home.browse" />
              </Link>
            </div>
          </div>
          { ::this.renderNews(posts) }
          {loading && isEmpty(posts) && (
            <div className="ui segment basic has-header">
              <div className="ui active inverted dimmer">
                <div className="ui indeterminate text loader">
                  <Translate content="wall.loading" />
                </div>
              </div>
            </div>
          )}
          {!loading && isEmpty(posts) && (
            <div>
              <div className="ui hidden divider"></div>
              <div className="ui segment basic has-header center aligned">
                <Translate content="post.nodata" />
              </div>
            </div>
          )}
          <div className="ui basic segment center">
            <a href="http://www.ccnda.org" target="_blank">
              <div className="image logo"></div>
            </a>
          </div>
        </div>
        <div className="four wide computer sixteen wide tablet column">
          <div className="ui basic segment center">
            <Link to="/post">
              <div className="image logo-oursevents"></div>
            </Link>
            <CpropList
              className="ui relaxed list"
              defaultLocale={this.props.defaultLocale} />
          </div>
        </div>
      </main>
    )
  }
}
