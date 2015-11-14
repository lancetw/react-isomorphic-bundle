import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'

export default class Tab extends Component {

  static propTypes = {
    children: PropTypes.any,
    active: PropTypes.bool,
    onSelect: PropTypes.func,
    index: PropTypes.number
  }

  constructor (props) {
    super(props)
  }

  render () {
    const statusClass = classNames('item', { 'active': !!this.props.active })

    return (
      <a
        className={statusClass}
        onClick={::this.props.onSelect.bind(this, this.props.index)}>
        {this.props.children}
      </a>
    )
  }
}
