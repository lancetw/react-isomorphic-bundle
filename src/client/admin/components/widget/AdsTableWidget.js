import React, { PropTypes } from 'react'
import { isEmpty, contains, without } from 'lodash'
import classNames from 'classnames'
import { toDate } from 'shared/utils/date-utils'

if (process.env.BROWSER) {
}

export default class AdsTableWidget extends React.Component {

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

    this.props.action(checked, this.state.page).then(() => {
      this.setState({ checked: [] })
    })
  }

  isChecked (id) {
    return contains(this.state.checked, id)
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
    const btnLabel = (!this.props.selected) ? '新增' : '刪除'
    return (
      <div
        onClick={::this.handleClick}
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
      'stackable',
      'striped',
      'table'
    )

    return (
      <table className={TableClasses}>
        <thead className="full-width">
          <tr>
            <th></th>
            <th className="table name">名稱</th>
            <th className="table script">廣告網址</th>
            <th className="table comment">備註</th>
          </tr>
        </thead>
        <tbody>
        {!isEmpty(items) && items.map(function(item, i) {
          const checked = isChecked(item.id)
          return (
          <tr>
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
            <td className="table name">
              { item.name }
            </td>
            <td className="table script">
              { item.script }
            </td>
            <td className="table comment">{ item.comment }</td>
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


