import React from 'react'
import { Link } from 'react-router'
import counterpart from 'counterpart'
import WallButtons from 'shared/components/wall/WallButtons'
import { PostPropArray } from 'shared/utils/forms'
import { keys, map, range, at } from 'lodash'
import { fixLocaleName, originLocaleName } from 'shared/utils/locale-utils'
import { BaseComponent } from 'shared/components'
import shouldPureComponentUpdate from 'react-pure-render/function'

export default class Cprop extends BaseComponent {

  static propTypes = {}

  constructor (props) {
    super(props)

    counterpart.onLocaleChange(::this.handleLocaleChange)
    this.state = { locale: this.getLocale() }
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  handleLocaleChange (newLocale) {
    if (this.isMounted()) {
      const locale = fixLocaleName(newLocale)
      this.setState({ locale: locale })
    }
  }

  renderCprop () {
    const _lang = originLocaleName(this.state.locale)
    const _size = keys(PostPropArray(_lang)).length
    const _range = range(1, _size)
    return map(_range, (index) => {
      return (
        <div
          className="item" key={index}>
          <Link
            className="fluid ui huge black button"
            to={`/w/cprop/${index}`}>
            {this.renderCardProp(index)}
          </Link>
        </div>
      )
    })
  }

  renderCardProp (index) {
    return (
      <span>
        {at(PostPropArray(originLocaleName(this.getLocale())), index)}
      </span>
    )
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
                { this.renderCprop() }
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }
}
