import React, { PropTypes } from 'react'
import classNames from 'classnames'

export default class TabPanel extends React.Component {

  constructor (props) {
    super(props)
  }

  static propTypes = {
    children: PropTypes.any,
    selectedIndex: PropTypes.number,
    index: PropTypes.number
  }

  static defaultProps = {
    index: 0
  }

  render () {
    const actived = this.props.selectedIndex === this.props.index
    const status = actived ?
      classNames('ui', 'bottom', 'attached', 'tab', 'segment', 'active') :
      classNames('ui', 'bottom', 'attached', 'tab', 'segment')

    return (
      actived && (
        <div className={status}>
          {this.props.children}
        </div>
      )
    )
  }
}
