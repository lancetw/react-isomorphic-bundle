import React, { PropTypes } from 'react'
import { isEmpty, contains, without } from 'lodash'
import { toDate } from 'shared/utils/date-utils'
import {
  Pagination
} from 'client/admin/components/widget'

if (process.env.BROWSER) {
}

export default class TableWidget extends React.Component {

  static propTypes = {
    post: PropTypes.object.isRequired,
    markAsSpam: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)

    this.state = { checked: [] }
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

  isChecked (id) {
    return contains(this.state.checked, id)
  }

  render () {
    const { posts } = this.props.post
    const handleChange = ::this.handleChange
    const isChecked = ::this.isChecked
    return (
      <table className="ui definition compact stackable striped table">
        <thead className="full-width">
          <tr>
            <th></th>
            <th className="table title">標題</th>
            <th className="table date">發文日期</th>
            <th className="table email">發文者</th>
          </tr>
        </thead>
        <tbody>
        {!isEmpty(posts) && posts.map(function(post, i) {
          const checked = isChecked(post.id)
          return (
          <tr>
            <td className="collapsing">
              <div className="ui fitted slider checkbox">
                <input
                  type="checkbox"
                  defaultChecked="false"
                  checked={checked}
                  onChange={handleChange.bind(this, post.id)} />
                <label></label>
              </div>
            </td>
            <td className="table title">
              <a target="_blank" href={`../w/p/${post.id}`}>
                { post.title }
              </a>
            </td>
            <td className="table date">{ toDate(post.created_at, true) }</td>
            <td className="table email">{ post['user.email'] }</td>
          </tr>
          )
        })}
        </tbody>
        <tfoot className="full-width">
          <tr>
            <th colSpan="5">
              <a
                className="ui left floated tiny red button"
                onClick={this.props.markAsSpam}>
                標記垃圾文章
              </a>
              <Pagination {...this.props} />
            </th>
          </tr>
        </tfoot>
      </table>
    )
  }
}


