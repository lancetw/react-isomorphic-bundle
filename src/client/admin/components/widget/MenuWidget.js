import React, { PropTypes } from 'react'
import { Link } from 'react-router'

if (process.env.BROWSER) {
}

export default class MenuWidget extends React.Component {

  static propTypes = {
    logout: PropTypes.func.isRequired
  }

  static contextTypes = {
    history: PropTypes.object.isRequired
  }

  constructor (props, context) {
    super(props, context)
  }

  doLogout () {
    this.props.logout()
    this.context.history.replaceState({}, '/ring')
  }

  render () {
    return (
      <div className="ui labeled icon menu">
        <Link className="item">
          <i className="cube icon"></i>
          佈告管理
        </Link>
        <Link className="item">
          <i className="user icon"></i>
          使用者維護
        </Link>
        <Link className="item">
          <i className="setting icon"></i>
          廣告設定
        </Link>
        <Link to="/ring" className="item" onClick={::this.doLogout}>
          <i className="sign out icon"></i>
          登出
        </Link>
      </div>
    )
  }
}


