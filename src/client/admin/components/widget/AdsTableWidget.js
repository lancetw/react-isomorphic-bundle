import React, { Component, PropTypes } from 'react'
import { isEmpty, includes, without } from 'lodash'
import classNames from 'classnames'
import { toDate } from 'shared/utils/date-utils'
import { endsWith } from 'lodash'

let swal
if (process.env.BROWSER) {
  swal = require('sweetalert')
}

export default class AdsTableWidget extends Component {

  static propTypes = {
    collect: PropTypes.object.isRequired,
    deleteAction: PropTypes.func.isRequired,
    fetchList: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired,
    selected: PropTypes.number
  }

  static defaultProps = {
    selected: 0
  }

  constructor (props) {
    super(props)

    this.state = { checked: [], page: 1 }
  }

  handleChange (id, e) {
    let checked = this.state.checked
    if (e.target.checked) {
      if (!includes(checked, id)) {
        checked.push(id)
        this.setState({ checked: checked })
      }
    } else {
      if (includes(checked, id)) {
        checked = without(checked, id)
      }
      this.setState({ checked: checked })
    }
  }

  handleClick () {
    swal({
      title: '新增 Google 廣告路徑',
      text: '請輸入 Google 廣告路徑',
      type: 'input',
      showCancelButton: true,
      closeOnConfirm: false,
      animation: 'slide-from-top',
      inputPlaceholder: '網址',
      confirmButtonText: '確認',
      cancelButtonText: '取消',
      confirmButtonColor: '#ff8800'
    }, function (link) {
      if (link === false) {
        return false
      }
      if (link === '') {
        swal.showInputError('輸入有誤')
        return false
      }

      swal({
        title: '確認設定',
        text: '請輸入 googlead',
        type: 'input',
        showCancelButton: true,
        closeOnConfirm: false,
        animation: 'slide-from-top',
        inputPlaceholder: '',
        confirmButtonText: '確認',
        cancelButtonText: '取消',
        confirmButtonColor: '#ff8800',
        showLoaderOnConfirm: true
      }, function (size) {
        if (size === false) {
          return false
        }
        if (size !== 'googlead') {
          swal.showInputError('輸入有誤')
          return false
        }

        this.props.submit({ name: size, script: link })
        .then((res) => {
          const { ad } = res
          if (ad && ad.name) {
            swal('完成', '設定完畢', 'success')
            this.props.fetchList({ offset: 0, limit: 10, status: 0 })
          } else {
            swal('新增失敗', '失敗，請重試', 'error')
          }
        }).catch((err) => {
          swal('失敗', err, 'error')
        })
      }.bind(this))
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
    return includes(this.state.checked, id)
  }

  renderActionBtn () {
    const ActionBtnClasses = classNames(
      'ui',
      {'blue': isEmpty(this.state.checked) },
      {'red': !isEmpty(this.state.checked) },
      'button',
      {'loading': !this.props.collect.done },
      {'disabled': !this.props.collect.done }
    )
    const btnLabel = isEmpty(this.state.checked) ? '新增' : '刪除'
    return (
      <div
        onClick={
          isEmpty(this.state.checked)
          ? ::this.handleClick
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

    const TableClasses = classNames(
      'ui',
      'definition',
      'compact',
      'unstackable',
      'striped',
      'table'
    )

    return (
      <table className={TableClasses}>
        <thead className="full-width">
          <tr>
            <th></th>
            <th className="table size">尺寸</th>
            <th className="table script">廣告網址</th>
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
            <td className="table size">
              { item.name }
            </td>
            <td className="table script">
              { item.script }
            </td>
          </tr>
          )
        })}
        </tbody>
        <tfoot className="full-width">
          <tr>
            <th colSpan="5">
              {::this.renderActionBtn()}
            </th>
          </tr>
        </tfoot>
      </table>
    )
  }
}
