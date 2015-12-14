import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import WallButtons from 'shared/components/wall/WallButtons'
import { PostPropArray } from 'shared/utils/forms'
import { keys, map, range, at } from 'lodash'
import { originLocaleName } from 'shared/utils/locale-utils'
import classNames from 'classnames'

export default class CpropList extends Component {

  static propTypes = {
    defaultLocale: PropTypes.string.isRequired,
    className: PropTypes.string
  }

  constructor (props) {
    super(props)
  }

  renderCprop () {
    const _lang = originLocaleName(this.props.defaultLocale)
    const _size = keys(PostPropArray(_lang)).length
    const _range = range(1, _size)
    const colors = [
      'black',
      'red',
      'orange',
      'yellow',
      'olive',
      'green',
      'teal',
      'blue',
      'violet',
      'purple',
      'pink',
      'brown',
      'white'
    ]
    return map(_range, (index) => {
      const cardPropClasses = classNames(
        'ui',
        'fluid',
        'large',
        'button',
        { [`${colors[index]}`]: true }
      )

      return (
        <div
          className="item" key={index}>
          <Link
            className={cardPropClasses}
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
      <div className={this.props.className}>
        { this.renderCprop() }
      </div>
    )
  }
}
