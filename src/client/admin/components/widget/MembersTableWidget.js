import React, { Component, PropTypes } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { isEmpty, includes, without } from 'lodash'
import classNames from 'classnames'
import { toDate } from 'shared/utils/date-utils'
import {
  Pagination
} from 'client/admin/components/widget'

if (process.env.BROWSER) {
}

export default class MembersTableWidget extends Component {

  static propTypes = {
    collect: PropTypes.object.isRequired,
    action: PropTypes.func.isRequired,
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
    const checked = this.state.checked

    this.props.action(checked, this.state.page).then(() => {
      this.setState({ checked: [] })
    })
  }

  isChecked (id) {
    return includes(this.state.checked, id)
  }

  renderActionBtn () {
    const ActionBtnClasses = classNames(
      'ui',
      {'red': !this.props.selected },
      {'green': this.props.selected },
      'button',
      {'loading': !this.props.collect.done },
      {'disabled': isEmpty(this.state.checked) }
    )
    const btnLabel = (!this.props.selected) ? '凍結' : '啟用'
    return (
      <div
        onClick={::this.handleClick}
        className={ActionBtnClasses}>
        { btnLabel }
      </div>
    )
  }

  render () {
    const { items, isFetching } = this.props.collect
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

    const Message = isFetching
      ? (
        <div className="ui icon message">
          <i className="notched circle loading icon"></i>
          <div className="content">
            <div className="header">
              請稍候
            </div>
            <p>資料載入中...</p>
          </div>
        </div>
        )
      : null

    return (
      <div>
        <table className={TableClasses}>
          <thead className="full-width">
            <tr>
              <th></th>
              <th className="table email">電子郵件信箱</th>
              <th className="table ocname">所屬組織</th>
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
                { (checked)
                  && (<a className="delete" target="_blank" href={`../w/${item.id}`}>
                    { item.email }
                  </a>)
                }
                { (!checked)
                  && (<a target="_blank" href={`/ring/members/${item.id}`}>
                    { item.email }
                  </a>)
                }
              </td>
              <td className="table ocname">
                { (!!item['userInfo.url']) &&
                  <a target="_blank" href={`../w/${item['userInfo.url']}`}>
                    { item['usersInfo.ocname'] }
                  </a>
                }
                { !(!!item['userInfo.url']) &&
                  item['usersInfo.ocname']
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
                <Pagination {...this.props} />
              </th>
            </tr>
          </tfoot>
        </table>
        <ReactCSSTransitionGroup
          transitionName="MessageTransition"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}>
          {Message}
        </ReactCSSTransitionGroup>
      </div>
    )
  }
}
