import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import classNames from 'classnames'
import { isFinite } from 'lodash'

if (process.env.BROWSER) {
}

export default class MembersNavWidget extends React.Component {

  static propTypes = {
    collect: PropTypes.object.isRequired,
    selected: PropTypes.number,
    fetchList: PropTypes.func.isRequired
  }

  static defaultProps = {
    selected: 0
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
      limit: 5,
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
      return '使用者列表'
    } else {
      return '凍結的使用者'
    }
  }

  renderCounter (index) {
    if (index === 0) {
      const count = isFinite(this.props.collect.count) ? this.props.collect.count : '-'
      return (
        <div className="ui orange label">{count}</div>
      )
    } else {
      const count = isFinite(this.props.collect.blockedCount) ? this.props.collect.blockedCount : '-'
      return (
        <div className="ui label">{count}</div>
      )
    }
  }

  render () {
    return (
      <div className="ui fluid vertical menu">
        <Link
          to="/ring/members"
          className={this.menuItemClass(this.props.selected, 0)}>
          {this.renderCounter(0)}
          {this.renderLabel(0)}
        </Link>
        <Link
          to="/ring/blocked"
          className={this.menuItemClass(this.props.selected, 1)}>
          {this.renderCounter(1)}
          {this.renderLabel(1)}
        </Link>
        <div className="item">
          <div className="ui icon input">
            <input
              ref="search"
              value={this.state.userInput}
              onFocus={::this.handleSearchFocus}
              onChange={::this.handleSearchChange}
              onKeyUp={::this.handleSearchKeyUp}
              onKeyDown={::this.handleSearchKeyDown}
              onBlur={::this.handleBlur}
              type="text"
              placeholder="搜尋..." />
            <i className="search icon"></i>
          </div>
        </div>
      </div>
    )
  }
}


