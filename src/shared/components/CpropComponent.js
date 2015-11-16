import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import WallButtons from 'shared/components/wall/WallButtons'
import { PostPropArray } from 'shared/utils/forms'
import { keys, map, range, at } from 'lodash'
import { fixLocaleName, originLocaleName } from 'shared/utils/locale-utils'
import shouldPureComponentUpdate from 'react-pure-render/function'

export default class Cprop extends Component {

  static propTypes = {
    defaultLocale: PropTypes.string.isRequired
  }

  constructor (props) {
    super(props)
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  renderCprop () {
    const _lang = originLocaleName(this.props.defaultLocale)
    const _size = keys(PostPropArray(_lang)).length
    const _range = range(1, _size)
    return map(_range, (index) => {
      return (
        <div
          className="item" key={index}>
          <Link
            className="ui fluid huge orange button"
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
        {at(PostPropArray(originLocaleName(this.props.defaultLocale)), index)}
      </span>
    )
  }

  /* eslint-disable max-len */
  render () {
    return (
      <main className="ui has-header grid centered container">
        <div className="sixteen wide tablet six wide computer column">
          <WallButtons />
          <div className="ui relaxed list">
            { this.renderCprop() }
          </div>
        </div>
      </main>
    )
  }
}
