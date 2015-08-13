import React, { PropTypes } from 'react'

export default class TabList extends React.Component {

  constructor (props) {
    super(props)
  }

  static propTypes = {
    children: PropTypes.any,
    onSelect: PropTypes.func,
    selectedIndex: PropTypes.number
  }

  render () {
    return (
      <div className="ui top orange stackable container menu">
        {React.Children.map(this.props.children, (child, index) => {
          return index === this.props.selectedIndex ?
            React.cloneElement(child, {
              active: true,
              onSelect: this.props.onSelect,
              index: index,
              ref: 'tab-' + index
            }) :
            React.cloneElement(child, {
              active: false,
              onSelect: this.props.onSelect,
              index: index,
              ref: 'tab-' + index
            })
        })}
      </div>
    )
  }
}
