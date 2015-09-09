import React, { PropTypes } from 'react'

export default class Tabs extends React.Component {

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
    this.state = { index: this.props.selectedIndex }
    this.handleSelect = ::this.handleSelect
  }

  handleSelect (index) {
    this.setState({ index })
    if (typeof this.props.onSelect === 'function') {
      this.props.onSelect(
        index || this.props.selectedIndex,
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
              selectedIndex: this.state.index
            }
          )
        })}
      </div>
    )
  }
}
