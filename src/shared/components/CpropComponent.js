import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import DayPicker from 'react-day-picker'
import moment from 'moment'
import 'moment/locale/zh-tw'
import counterpart from 'counterpart'
import classNames from 'classnames'
import WallButtons from 'shared/components/wall/WallButtons'
import { PostPropArray } from 'shared/utils/forms'
import { keys, map, range, at } from 'lodash'
import { fixLocaleName, originLocaleName } from 'shared/utils/locale-utils'

export default class Cal extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      locale: fixLocaleName(counterpart.getLocale())
    }

    counterpart.onLocaleChange(::this.handleLocaleChange)
  }

  static propTypes = {}

  handleLocaleChange (newLocale) {
    const locale = fixLocaleName(newLocale)
    moment.locale(locale)
    this.setState({ locale })
  }

  getCardProp (index) {
    const _lang = originLocaleName(this.state.locale)
    return at(PostPropArray(_lang), index)
  }

  renderCprop () {
    const _lang = originLocaleName(this.state.locale)
    const _size = keys(PostPropArray(_lang)).length
    const _range = range(1, _size + 1)
    return map(_range, (index) => {
      return (
        <div
          className="item" key={index}>
          <Link
            className="fluid ui huge red button"
            to={`/wall/cprop/${index}`}>
            { this.getCardProp(index) }
          </Link>
        </div>
      )
    })
  }

  /* eslint-disable max-len */
  render () {
    const Translate = require('react-translate-component')

    return (
      <main className="ui one column has-header grid container">
        <div className="column">
          <WallButtons />
          <div className="row">
            <div className="ui basic segment">
              <div className="ui relaxed list">
                { ::this.renderCprop() }
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }
}
