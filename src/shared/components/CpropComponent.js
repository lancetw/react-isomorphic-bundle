import React from 'react'
import { Link } from 'react-router'
import moment from 'moment'
import 'moment/locale/zh-tw'
import counterpart from 'counterpart'
import WallButtons from 'shared/components/wall/WallButtons'
import { postPropArray } from 'shared/utils/forms'
import { keys, map, range, at } from 'lodash'
import { fixLocaleName, originLocaleName } from 'shared/utils/locale-utils'

export default class Cal extends React.Component {

  static propTypes = {}

  constructor (props) {
    super(props)

    counterpart.setLocale(props.defaultLocale)

    this.state = {
      locale: fixLocaleName(counterpart.getLocale())
    }

    counterpart.onLocaleChange(::this.handleLocaleChange)
  }

  getCardProp (index) {
    const _lang = originLocaleName(this.state.locale)
    return at(postPropArray(_lang), index)
  }

  renderCprop () {
    const _lang = originLocaleName(this.state.locale)
    const _size = keys(postPropArray(_lang)).length
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

  handleLocaleChange (newLocale) {
    if (process.env.BROWSER) {
      const locale = fixLocaleName(newLocale)
      moment.locale(locale)
      this.setState({ locale })
    }
  }

}
