import React, { PropTypes } from 'react'
import classNames from 'classnames'

export default class Tab extends React.Component {

  constructor (props) {
    super(props)
  }

  static propTypes = {
    children: PropTypes.any,
    active: PropTypes.bool,
    onSelect: PropTypes.func,
    index: PropTypes.number
  }

  render () {
    const status = this.props.active ?
      classNames('item', 'active') :
      classNames('item')

    return (
      <a
        className={status}
        onClick={::this.props.onSelect.bind(this, this.props.index)}>
        {this.props.children}
      </a>
    )
  }
}
