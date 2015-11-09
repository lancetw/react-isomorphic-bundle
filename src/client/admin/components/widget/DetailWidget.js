import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router'
import classNames from 'classnames'
import { isEmpty } from 'lodash'
import { toDate } from 'shared/utils/date-utils'

let swal
if (process.env.BROWSER) {
  swal = require('sweetalert')
}

export default class DetailWidget extends React.Component {

  static propTypes = {
    collect: PropTypes.object.isRequired,
    changePassword: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)

    this.state = { password: '' }
  }

  clearInput () {
    this.setState({ password: '' })
  }

  handleChange (event) {
    this.setState({ password: event.target.value })
  }

  changePassword () {
    const password = ReactDOM.findDOMNode(this.refs.password).value
    const _changePassword = this.props.changePassword
    const clearInput = ::this.clearInput
    if (!password) return false
    const { detail } = this.props.collect
    swal({
      title: '確認變更',
      text: '請輸入使用者的 Email 以確定修改',
      type: 'input',
      showCancelButton: true,
      closeOnConfirm: false,
      animation: 'slide-from-top',
      inputPlaceholder: 'Email',
      confirmButtonText: '確認',
      cancelButtonText: '取消',
      confirmButtonColor: '#ff8800',
      showLoaderOnConfirm: true
    }, function (inputValue) {
      if (inputValue === false) {
        return false
      }
      if (inputValue !== detail.email) {
        swal.showInputError('輸入有誤')
        return false
      }

      _changePassword({ id: detail.id, password: password })
      .then((res) => {
        const { info } = res
        if (info && info.email === detail.email) {
          swal('完成', inputValue + ' 的密碼已修改', 'success')
          clearInput()
        } else {
          swal('失敗', inputValue + ' 修改失敗', 'error')
          clearInput()
        }
      })
      .catch(() => {
        swal('失敗', '無法連接伺服器', 'error')
        clearInput()
      })
    })
  }

  render () {
    const { detail } = this.props.collect

    if (isEmpty(detail)) {
      return (
        <div className="ui fluid card">
        </div>
      )
    } else {
      return (
        <div className="ui fluid centered orange card">
          <div className="content">
            <div className="ui orange large header">{ detail.email }</div>
            <div className="meta">
              <span className="date">加入日期：{ toDate(detail.created_at) }</span>
            </div>
            <div className="description">
              名稱：{ detail.name }
            </div>
            <div className="ui list">
              <div className="item">所屬組織：{ detail['usersInfo.ocname'] }</div>
              <div className="item">組織信箱：{ detail['usersInfo.email'] }</div>
              <div className="item">聯絡人：{ detail['usersInfo.contact'] }</div>
              <div className="item">國家：{ detail['usersInfo.country'] }</div>
              <div className="item">縣市：{ detail['usersInfo.city'] }</div>
              <div className="item">地址：{ detail['usersInfo.address'] }</div>
              <div className="item">郵遞區號：{ detail['usersInfo.zipcode'] }</div>
              <div className="item">電話：{ detail['usersInfo.tel'] }</div>
              <div className="item">傳真：{ detail['usersInfo.fax'] }</div>
              <div className="item">網站：
                { detail['usersInfo.url']
                  && (
                    <a target="_blank" href={ detail['usersInfo.url'] }>
                      { detail['usersInfo.url'] }
                    </a>
                  )
                }
                { !detail['usersInfo.url']
                  && (
                    <span></span>
                  )
                }
              </div>
            </div>
          </div>
          <div className="extra content">
            <div className="ui action large fluid input">
              <input
                ref="password"
                onChange={::this.handleChange}
                type="text"
                placeholder="密碼..."
                value={this.state.password} />
              <button
                onClick={::this.changePassword}
                className="ui orange button">
                設定新密碼
              </button>
            </div>
          </div>
        </div>
      )
    }
  }
}
