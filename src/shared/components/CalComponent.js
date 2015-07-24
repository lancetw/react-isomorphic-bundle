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

if (process.env.BROWSER)
  require('css/ui/date-picker')

export default class Cal extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      locale: this.fixLocaleName(counterpart.getLocale()),
      date: moment(new Date()).valueOf(),
      selectedDay: new Date(),
      nextOffset: 0,
      limit: 5
    }

    counterpart.onLocaleChange(::this.handleLocaleChange)
  }

  static propTypes = {
    fetchList: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired
  }

  handleDayClick (e, day) {
    const date = moment(day).valueOf()
    const reload = true
    this.props.fetchList(0, 5, date, null, reload)

    this.setState({
      date: date,
      selectedDay: day,
      nextOffset: 5
    })
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

  render () {
    const Translate = require('react-translate-component')
    const { locale } = this.state
    const { selectedDay } = this.state
    const modifiers = {
      'selected': (day) => isSameDay(selectedDay, day)
    }

    return (
      <main className="ui stackable page centered grid">
        <div className="column">
          <div className="row">
            <div className="ui orange inverted buttons">
              <Link className="ui button" to='/wall/today'>
                <Translate content="header.wall" />
              </Link>
              <Link className="ui button" to='/wall/cal'>
                <Translate content="header.cal" />
              </Link>
            </div>
          </div>
          <div className="ui horizontal divider" />
          <div className="row">
            <div className="ui segment">
              <DayPicker className="ui centered row compact"
                modifiers={ modifiers }
                onDayClick={ ::this.handleDayClick }
                locale={ locale }
                localeUtils={ LocaleUtils }
              />
            </div>
          </div>
          <div className="ui horizontal header divider">
            { moment(selectedDay).format('LL') }
          </div>
          <div className="row">
            <Cards
              posts={this.props.post.posts}
              loadFunc={::this.loadFunc}
              hasMore={this.props.post.hasMore}
            />
            {this.props.post.loading && (
              <div className="ui segment basic has-header">
                <div className="ui active inverted dimmer">
                  <div className="ui large text loader">
                    <Translate content="wall.loading" />
                  </div>
                </div>
              </div>
            )}
            {isEmpty(this.props.post.posts) && (
              <div className="ui segment basic center aligned">
                <Translate content="post.nodata" />
              </div>
            )}
          </div>
        </div>
      </main>
    )
  }
}
