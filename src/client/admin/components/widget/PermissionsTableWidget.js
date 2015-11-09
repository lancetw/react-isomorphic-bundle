import React, { PropTypes } from 'react'
import { isEmpty, contains, without } from 'lodash'
import classNames from 'classnames'
import { toDate } from 'shared/utils/date-utils'
import {
  Pagination
} from 'client/admin/components/widget'

let swal
if (process.env.BROWSER) {
  swal = require('sweetalert')
}

export default class PermissionsTableWidget extends React.Component {

  static propTypes = {
    collect: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    action: PropTypes.func.isRequired,
    deleteAction: PropTypes.func.isRequired,
    fetchList: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired,
    changePassword: PropTypes.func.isRequired,
    selected: PropTypes.number
  }

  static defaultProps = {
    selected: 0
  }

  constructor (props) {
    super(props)

    this.state = { checked: [], page: 1 }
  }

  handleChange (id, event) {
    let checked = this.state.checked
    if (event.target.checked) {
      if (!contains(checked, id)) {
        checked.push(id)
        this.setState({ checked: checked })
      }
    } else {
      if (contains(checked, id)) {
        checked = without(checked, id)
      }
      this.setState({ checked: checked })
    }
  }

  handleClick () {
    const checked = this.state.checked

    this.props.action(checked).then(() => {
      this.setState({ checked: [] })
    }).catch(() => {
      this.setState({ checked: [] })
    })
  }

  handleCreateClick () {
    swal({
      title: '新增管理者',
      text: '請輸入 Email',
      type: 'input',
      showCancelButton: true,
      closeOnConfirm: false,
      animation: 'slide-from-top',
      inputPlaceholder: 'Email',
      confirmButtonText: '確認',
      cancelButtonText: '取消',
      confirmButtonColor: '#ff8800'
    }, function (email) {
      if (email === false) {
        return false
      }
      if (email === '') {
        swal.showInputError('輸入有誤')
        return false
      }

      swal({
        title: '新增管理者',
        text: '請輸入密碼',
        type: 'input',
        inputType: 'password',
        showCancelButton: true,
        closeOnConfirm: false,
        animation: 'slide-from-top',
        inputPlaceholder: '密碼（長度應大於 6）',
        confirmButtonText: '確認',
        cancelButtonText: '取消',
        confirmButtonColor: '#ff8800'
      }, function (password) {
        if (password === false) {
          return false
        }
        if (password === '') {
          swal.showInputError('輸入有誤')
          return false
        }

        swal({
          title: '新增管理者',
          text: '名稱（可不填）',
          type: 'input',
          showCancelButton: true,
          closeOnConfirm: false,
          animation: 'slide-from-top',
          inputPlaceholder: '名稱',
          confirmButtonText: '確認',
          cancelButtonText: '取消',
          confirmButtonColor: '#ff8800',
          showLoaderOnConfirm: true
        }, function (name) {
          this.props.submit({ email: email, password: password, name: name })
          .then((res) => {
            const { admin, errors } = res
            if (admin && admin.email === email) {
              swal('完成', email + ' 已新增', 'success')
              this.props.fetchList({ offset: 0, limit: 8, status: 0 })
            } else {
              if (!isEmpty(errors)) {
                const message = errors[0].message
                if (message === 'email must be unique') {
                  swal('新增失敗', email + ' 已存在', 'error')
                } else if (message === 'should be an email') {
                  swal('新增失敗', email + ' 不是個 email', 'error')
                } else if (message === 'length should bigger than 6') {
                  swal('新增失敗', '密碼太短', 'error')
                } else {
                  swal('新增失敗', email + ' 新增時發生錯誤', 'error')
                }
              }
            }
          })
          .catch((err) => {
            swal('失敗', err, 'error')
          })
        }.bind(this))
      }.bind(this))
    }.bind(this))
  }

  handleChangePasswordClick (id, event) {
    swal({
      title: '修改密碼',
      text: '請輸入新密碼',
      type: 'input',
      inputType: 'password',
      showCancelButton: true,
      closeOnConfirm: false,
      animation: 'slide-from-top',
      inputPlaceholder: '密碼（長度應大於 6）',
      confirmButtonText: '確認',
      cancelButtonText: '取消',
      confirmButtonColor: '#ff8800',
      showLoaderOnConfirm: true
    }, function (password) {
      if (password === false) {
        return false
      }
      if (password === '') {
        swal.showInputError('輸入有誤')
        return false
      }

      this.props.changePassword({ id: id, password: password })
      .then((res) => {
        const { admin } = res
        if (admin && admin.email) {
          swal('完成', admin.email + ' 已更新密碼', 'success')
        } else {
          swal('新增失敗', '失敗，請重試', 'error')
        }
      }).catch((err) => {
        swal('失敗', err, 'error')
      })
    }.bind(this))
  }

  handleDeleteClick () {
    const checked = this.state.checked

    this.props.deleteAction(checked).then(() => {
      this.setState({ checked: [] })
    }).catch(() => {
      this.setState({ checked: [] })
    })
  }

  isChecked (id) {
    return contains(this.state.checked, id)
  }

  renderActionBtn () {
    const ActionBtnClasses = classNames(
      'ui',
      {'yellow': !this.props.selected },
      {'green': this.props.selected },
      'button',
      {'loading': !this.props.collect.done },
      {'disabled': isEmpty(this.state.checked) }
    )
    const btnLabel = (!this.props.selected) ? '停權' : '復權'
    return (
      <div
        onClick={::this.handleClick}
        className={ActionBtnClasses}>
        { btnLabel }
      </div>
    )
  }

  renderUserActionBtn () {
    const ActionBtnClasses = classNames(
      'ui',
      {'blue': !this.props.selected },
      {'red': this.props.selected },
      'button',
      {'loading': false },
      {'disabled': false }
    )
    const btnLabel = (!this.props.selected) ? '新增' : '封鎖'
    return (
      <div
        onClick={
          (!this.props.selected)
            ? ::this.handleCreateClick
            : ::this.handleDeleteClick}
        className={ActionBtnClasses}>
        { btnLabel }
      </div>
    )
  }

  render () {
    const { items } = this.props.collect
    const handleChange = ::this.handleChange
    const isChecked = ::this.isChecked
    const handleChangePasswordClick = ::this.handleChangePasswordClick

    const TableClasses = classNames(
      'ui',
      'definition',
      'compact',
      'stackable',
      'striped',
      'table'
    )

    return (
      <table className={TableClasses}>
        <thead className="full-width">
          <tr>
            <th></th>
            <th className="table email">電子郵件信箱</th>
            <th className="table name">名稱</th>
            <th className="table date">加入日期</th>
          </tr>
        </thead>
        <tbody>
        {!isEmpty(items) && items.map(function(item, i) {
          const checked = isChecked(item.id)
          return (
          <tr key={item.id}>
            <td className="collapsing">
              <div className="ui checkbox">
                <input
                  type="checkbox"
                  defaultChecked="false"
                  checked={checked}
                  onChange={handleChange.bind(this, item.id)} />
                <label></label>
              </div>
            </td>
            <td className="table email">
              { (checked) && (
                <div
                  onClick={handleChangePasswordClick.bind(this, item.id)}
                  className="ui orange small header">
                  { item.email }
                </div>)
              }
              { (!checked) && (
                <div
                  onClick={handleChangePasswordClick.bind(this, item.id)}
                  className="ui orange small header">
                  { item.email }
                </div>)
              }
            </td>
            <td className="table name">{ item.name }</td>
            <td className="table date">{ toDate(item.created_at, true) }</td>
          </tr>
          )
        })}
        </tbody>
        <tfoot className="full-width">
          <tr>
            <th colSpan="5">
              {::this.renderActionBtn()}
              {::this.renderUserActionBtn()}
              <Pagination {...this.props} />
            </th>
          </tr>
        </tfoot>
      </table>
    )
  }
}
