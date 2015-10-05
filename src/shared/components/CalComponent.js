import React, { PropTypes } from 'react'
import { isEmpty } from 'lodash'
import Cards from 'shared/components/wall/PostCards'
import DayPicker from 'react-day-picker'
import { LocaleUtils } from 'react-day-picker/lib/addons'
import { isSameDay } from 'shared/utils/date-utils'
import moment from 'moment'
import 'moment/locale/zh-tw'
import 'moment/locale/zh-cn'
import counterpart from 'counterpart'
import WallButtons from 'shared/components/wall/WallButtons'
import { fixLocaleName } from 'shared/utils/locale-utils'
import { BaseComponent } from 'shared/components'
import { createHistory } from 'history'
import queryString from 'query-string'
import ADContent from './ADContent'

let unlisten
let history
if (process.env.BROWSER) {
  require('css/ui/date-picker')
  history = createHistory()
}

export default class Cal extends BaseComponent {

  static propTypes = {
    fetchList: PropTypes.func.isRequired,
    countPostsWithCal: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)

    counterpart.setLocale(this.getLocale())
    moment.locale(fixLocaleName(this.getLocale()))

    let day
    if (process.env.BROWSER) {
      day = queryString.parse(window.location.search).day
      if (typeof day === 'undefined') day = props.post.day
    }

    this.state = {
      date: day
        ? moment(day).startOf('day').valueOf()
        : moment(new Date()).startOf('day').valueOf(),
      selectedDay: day ? new Date(day) : new Date(),
      locale: fixLocaleName(this.getLocale())
    }

    counterpart.onLocaleChange(::this.handleLocaleChange)

    if (process.env.BROWSER) {
      unlisten = history.listen((location) => {
        day = queryString.parse(location.search).day
        this.setState({
          date: day
            ? moment(day).startOf('day').valueOf()
            : moment(new Date()).startOf('day').valueOf(),
          selectedDay: day ? new Date(day) : new Date()
        })
      })
    }
  }

  componentDidMount () {
    const day = this.state.date
    if (day) {
      const date = moment(day).startOf('day').valueOf()
      this.refs.daypicker.showMonth(new Date(day))
    }
  }

  componentWillUnmount () {
    if (process.env.BROWSER) {
      typeof unlisten === 'function' && unlisten()
    }
  }

  getTodayCount (date) {
    if (typeof date !== 'undefined') {
      const count = this.props.post.count[date]
      return typeof count !== 'undefined' && count !== null ? count : 0
    } else {
      return 0
    }
  }

  getTodayStartCount (date) {
    if (typeof date !== 'undefined') {
      const count = this.props.post.countStart[date]
      return typeof count !== 'undefined' && count !== null ? count : 0
    } else {
      return 0
    }
  }

  setHistory (day) {
    const pathname = window.location.pathname
    const _day = moment(day).format('YYYY-MM-DD')
    history.pushState({ the: 'state' }, pathname + '?day=' + _day)
  }

  handleDayClick (e, day) {
    const date = moment(day).valueOf()
    const reload = true
    this.props.fetchList(0, 10, date, null, reload)

    this.setHistory(day)

    this.setState({
      date: date,
      selectedDay: day
    })
  }

  handleMonthChange (day) {
    this.props.countPostsWithCal(moment(day).year(), moment(day).month() + 1)
  }

  handleLocaleChange (newLocale) {
    if (process.env.BROWSER) {
      const locale = fixLocaleName(newLocale)
      moment.locale(locale)
      this.setState({ locale })
    }
  }

  loadFunc () {
    const { post } = this.props
    this.props.fetchList(post.offset, post.limit, this.state.date)
  }

  renderDay (day) {
    const date = day.getDate()
    const count = this.getTodayStartCount(date)

    return (
      <div className="daybox">
        { count > 0 &&
          (<div className="day shake shake-slow">
            <div className="event-started">
              { date }
            </div>
          </div>)
        }
        { count === 0 &&
          (<div className="day">
            <div className="event-none">
              { date }
            </div>
          </div>)
        }
      </div>
    )
  }

  /* eslint-disable max-len */
  render () {
    const Translate = require('react-translate-component')
    const { post } = this.props
    const loading = post.isFetching || false
    const { selectedDay, locale } = this.state
    const modifiers = {
      'sunday': (day) => day.getDay() === 0,
      'saturday': (day) => day.getDay() === 6,
      'selected': (day) => isSameDay(selectedDay, day),
      'has-events-lv1': (day) => this.getTodayCount(day.getDate()) > 0,
      'has-events-lv2': (day) => this.getTodayCount(day.getDate()) > 50,
      'has-events-lv3': (day) => this.getTodayCount(day.getDate()) > 100,
      'has-events-lv4': (day) => this.getTodayCount(day.getDate()) > 200
    }

    return (
      <main className="ui two column has-header stackable grid container">
        <div className="eight wide computer sixteen wide tablet column">
          <WallButtons />
          <div className="ui hidden divider"></div>
          <DayPicker
            ref="daypicker"
            renderDay={::this.renderDay}
            modifiers={modifiers}
            onDayClick={::this.handleDayClick}
            onMonthChange={::this.handleMonthChange}
            locale={locale}
            localeUtils={LocaleUtils}
          />
          <ADContent />
        </div>
        <div className="eight wide computer sixteen wide tablet column">
          <div className="ui horizontal header divider">
            { moment(selectedDay).format('LL') }
          </div>
          <div className="row">
            <Cards
              posts={post.posts}
              loadFunc={::this.loadFunc}
              hasMore={post.hasMore}
              isFetching={loading}
              diff={129}
            />
            {loading && isEmpty(post.posts) && (
              <div className="ui segment basic has-header">
                <div className="ui active inverted dimmer">
                  <div className="ui indeterminate text loader">
                    <Translate content="wall.loading" />
                  </div>
                </div>
              </div>
            )}
            {!loading && isEmpty(post.posts) && (
              <div>
                <div className="ui hidden divider"></div>
                <div className="ui segment basic has-header center aligned">
                  <Translate content="post.nodata" />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    )
  }
}
