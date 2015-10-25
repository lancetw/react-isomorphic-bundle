import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import classNames from 'classnames'

import { logout } from 'client/admin/actions/AuthActions'

if (process.env.BROWSER) {
}

export default class MenuWidget extends React.Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    menuIndex: PropTypes.number
  }

  static contextTypes = {
    history: PropTypes.object.isRequired
  }

  static defaultProps = {
    menuIndex: 0
  }

  constructor (props, context) {
    super(props, context)
  }

  doLogout () {
    this.props.dispatch(logout()).then(() => {
      this.context.history.replaceState({}, '/ring')
    })
  }

  LinkClasses (index) {
    return classNames(
      { 'active': index === this.props.menuIndex },
      'item'
    )
  }

  render () {
    return (
      <div className="ui labeled icon menu">
        <Link to="/ring/dash" className={::this.LinkClasses(0)}>
          <i className="inbox icon"></i>
          佈告管理
        </Link>
        <Link to="/ring/members" className={::this.LinkClasses(1)}>
          <i className="users icon"></i>
          使用者維護
        </Link>
        <Link to="/ring/ads" className={::this.LinkClasses(2)}>
          <i className="browser icon"></i>
          廣告設定
        </Link>
        <Link to="/ring/permissions" className={::this.LinkClasses(3)}>
          <i className="spy icon"></i>
          權限
        </Link>
        <Link to="/ring" className="item" onClick={::this.doLogout}>
          <i className="sign out icon"></i>
          登出
        </Link>
      </div>
    )
  }
}
