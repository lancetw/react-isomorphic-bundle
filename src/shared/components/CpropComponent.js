import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import WallButtons from 'shared/components/wall/WallButtons'
import { PostPropArray } from 'shared/utils/forms'
import { keys, map, range, at } from 'lodash'
import { originLocaleName } from 'shared/utils/locale-utils'
import shouldPureComponentUpdate from 'react-pure-render/function'
import CpropList from './CpropList'

export default class Cprop extends Component {

  static propTypes = {
    defaultLocale: PropTypes.string.isRequired
  }

  constructor (props) {
    super(props)
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  /* eslint-disable max-len */
  render () {
    return (
      <main className="ui has-header grid centered container">
        <div className="sixteen wide tablet six wide computer column">
          <WallButtons />
            <CpropList
              className="ui relaxed list"
              defaultLocale={this.props.defaultLocale} />
        </div>
      </main>
    )
  }
}
