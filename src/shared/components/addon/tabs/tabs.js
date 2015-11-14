import React, { Component, PropTypes } from 'react'

export default class Tabs extends Component {

  static propTypes = {
    children: PropTypes.any,
    onSelect: PropTypes.func,
    handleSelect: PropTypes.func,
    selectedIndex: PropTypes.number
  }

  static defaultProps = {
    selectedIndex: 0
  }

  constructor (props) {
    super(props)
    this.state = { selectedIndex: this.props.selectedIndex }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({ selectedIndex: nextProps.selectedIndex })
  }

  handleSelect = (index) => {
    this.setState({ selectedIndex: index })
    if (typeof this.props.onSelect === 'function') {
      this.props.onSelect(
        index,
        React.Children.count(this.props.children) - 2
      )
    }
  }

  render () {
    return (
      <div>
        {React.Children.map(this.props.children, (child) => {
          return React.cloneElement(child,
            {
              onSelect: this.handleSelect,
              selectedIndex: this.state.selectedIndex || 0
            }
          )
        })}
      </div>
    )
  }
}
