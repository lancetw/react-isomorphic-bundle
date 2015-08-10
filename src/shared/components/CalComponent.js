import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { isEmpty } from 'lodash'
import Cards from 'shared/components/wall/PostCards'
import DayPicker from 'react-day-picker'
import { LocaleUtils } from 'react-day-picker/lib/addons'
import { isSameDay } from 'shared/utils/date-utils'
import moment from 'moment'
import 'moment/locale/zh-tw'
import counterpart from 'counterpart'
import classNames from 'classnames'
import MediaQuery from 'react-responsive'
import Ad from 'shared/components/addon/ad'

if (process.env.BROWSER)
  require('css/ui/date-picker')

export default class Cal extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      locale: this.fixLocaleName(counterpart.getLocale()),
      date: moment(new Date()).startOf('day').valueOf(),
      selectedDay: new Date(),
      nextOffset: 0,
      limit: 20
    }

    counterpart.onLocaleChange(::this.handleLocaleChange)
  }

  static propTypes = {
    fetchList: PropTypes.func.isRequired,
    countPostsWithCal: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired
  }

  handleDayClick (e, day) {
    const date = moment(day).valueOf()
    const reload = true
    this.props.fetchList(0, 20, date, null, reload)

    this.setState({
      date: date,
      selectedDay: day,
      nextOffset: 0
    })
  }

  handleMonthChange (day) {
    this.props.countPostsWithCal(moment(day).year(), moment(day).month() + 1)
  }

  handleLocaleChange (newLocale) {
    const locale = this.fixLocaleName(newLocale)
    moment.locale(locale)
    this.setState({ locale })
  }

  fixLocaleName (locale) {
    if (locale === 'zh-hant-tw')
      return 'zh-TW'

    return locale
  }

  loadFunc () {
    const nextOffset = this.state.nextOffset + this.state.limit
    this.props.fetchList(nextOffset - 1, this.state.limit, this.state.date)

    this.setState({ nextOffset: nextOffset })
  }

  getTodayCount (date) {
    if (typeof date !== 'undefined') {
      const count = this.props.post.count[date]
      return typeof count !== 'undefined' && count !== null ? count : 0
    } else return 0
  }

  getTodayStartCount (date) {
    if (typeof date !== 'undefined') {
      const count = this.props.post.countStart[date]
      return typeof count !== 'undefined' && count !== null ? count : 0
    } else return 0
  }

  renderDay (day) {
    const date = day.getDate()
    const count = this.getTodayStartCount(date)

    return (
      <div>
        <div className="day">
          { date }
        </div>
        { count > 0 && (<span className="event-started">＊</span>) }
        { count === 0 && (<span className="event-none">＊</span>) }
      </div>
    )
  }

  /* eslint-disable max-len */
  render () {
    const Translate = require('react-translate-component')
    const { post } = this.props
    const { locale } = this.state
    const { selectedDay } = this.state
    const modifiers = {
      'sunday': (day) => day.getDay() === 0,
      'saturday': (day) => day.getDay() === 6,
      'selected': (day) => isSameDay(selectedDay, day),
      'has-events-lv3': (day) => this.getTodayCount(day.getDate()) >= 10,
      'has-events-lv2': (day) => this.getTodayCount(day.getDate()) >= 5,
      'has-events-lv1': (day) => this.getTodayCount(day.getDate()) > 0,
      'has-event-slv0': (day) => this.getTodayCount(day.getDate()) === 0
    }

    return (
      <main className="ui stackable has-header grid">
        <div className="column">
          <div className="row">
            <div className="ui basic segment center aligned">
              <div className="ui orange inverted buttons">
                <Link className="ui button" to='/wall/today'>
                  <Translate content="header.wall" />
                </Link>
                <Link className="ui button" to='/wall/cal'>
                  <Translate content="header.cal" />
                </Link>
              </div>
            </div>
          </div>
          <div className="ui two column stackable grid">
            <div className="column">
              <div className="row">
                <DayPicker
                  renderDay={::this.renderDay}
                  modifiers={modifiers}
                  onDayClick={::this.handleDayClick}
                  onMonthChange={::this.handleMonthChange}
                  locale={locale}
                  localeUtils={LocaleUtils}
                />
              </div>
            </div>
            <div className="column">
              <div className="ui horizontal header divider">
                { moment(selectedDay).format('LL') }
              </div>
              <div className="row">
                <Cards
                  posts={post.posts}
                  loadFunc={::this.loadFunc}
                  hasMore={post.hasMore}
                />
                {post.loading && (
                  <div className="ui segment basic has-header">
                    <div className="ui active inverted dimmer">
                      <div className="ui large text loader">
                        <Translate content="wall.loading" />
                      </div>
                    </div>
                  </div>
                )}
                {!post.loading && isEmpty(post.posts) && (
                  <div className="ui segment basic center aligned">
                    <Translate content="post.nodata" />
                  </div>
                )}
              </div>
              <div className="ui horizontal hidden divider"></div>
              <div className="row">
                <MediaQuery minDeviceWidth={769}>
                  <div className="ui basic segment center aligned">
                    <Ad
                      id="1L"
                      link="http://mx1.hotrank.com.tw/script/oursweb/All_468x40"
                    />
                  </div>
                </MediaQuery>
                <MediaQuery maxDeviceWidth={768}>
                  <div className="ui basic segment center aligned">
                    <Ad
                      id="1S"
                      link="http://mx1.hotrank.com.tw/script/oursweb/200x200"
                    />
                  </div>
                </MediaQuery>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }
}
