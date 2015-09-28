import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import classNames from 'classnames'
import { isFinite } from 'lodash'

if (process.env.BROWSER) {
}

export default class AdsNavWidget extends React.Component {

  static propTypes = {
    collect: PropTypes.object.isRequired,
    selected: PropTypes.number,
    menuIndex: PropTypes.number,
    fetchList: PropTypes.func.isRequired
  }

  static defaultProps = {
    selected: 0,
    menuIndex: 0
  }

  constructor (props) {
    super(props)

    this.state = { userInput: '' }
    this.timer = null
  }

  menuItemClass (selected, index) {
    return classNames(
      'item',
      {active: (selected === index)}
    )
  }

  doSubmit (userInput) {
    this.props.fetchList({
      offset: 0,
      limit: 8,
      status: this.props.selected,
      keyword: userInput,
      reload: true
    })
    this.setState({ userInput })
  }

  handleSearchFocus () {
    this.setState({ userInput: '' })
  }

  handleSearchChange (event) {
    this.setState({ userInput: event.target.value })
  }

  handleSearchKeyUp (event) {
    const keyword = event.target.value
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.doSubmit(keyword)
      clearTimeout(this.timer)
    }, 650)
  }

  handleSearchKeyDown (event) {
    clearTimeout(this.timer)
  }

  handleBlur (event) {
    if (!this.state.userInput) {
      this.doSubmit('')
    }
  }

  renderLabel (index) {
    if (index === 0) {
      switch (this.props.menuIndex) {
      case 0:
        return '佈告列表'
      case 1:
        return '使用者列表'
      default:
        return ''
      }
    } else {
      switch (this.props.menuIndex) {
      case 0:
        return '垃圾回收筒'
      case 1:
        return '凍結的使用者'
      default:
        return ''
      }
    }
  }

  renderCounter (index) {
    if (index === 0) {
      const count = isFinite(this.props.collect.count) ? this.props.collect.count : '-'
      return (
        <div className="ui teal label">{count}</div>
      )
    } else {
      const count = isFinite(this.props.collect.spamCount) ? this.props.collect.spamCount : '-'
      return (
        <div className="ui label">{count}</div>
      )
    }
  }

  render () {
    return (
      <div className="ui fluid vertical menu">
        <Link
          to="/ring/permissions"
          className={this.menuItemClass(this.props.selected, 0)}>
          {this.renderCounter(0)}
          {this.renderLabel(0)}
        </Link>
        <Link
          to="/ring/disabled"
          className={this.menuItemClass(this.props.selected, 1)}>
          {this.renderCounter(1)}
          {this.renderLabel(1)}
        </Link>
      </div>
    )
  }
}


