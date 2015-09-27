import React, { PropTypes } from 'react'
import Cal from './CalComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as PostActions from '../actions/PostActions'
import { updateTitle } from '../actions/LocaleActions'
import DocumentTitle from './addon/document-title'
import moment from 'moment'
import { BaseComponent } from 'shared/components'
import queryString from 'query-string'

class CalHandler extends BaseComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired
  }

  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  constructor (props, context) {
    super(props)
    const { dispatch, resolver } = context.store
    dispatch(updateTitle('title.cal'))
    this.postActions = bindActionCreators(PostActions, dispatch)

    const { query } = props.location
    let date
    if (query && query.day) {
      const { day } = query
      date = moment(day).startOf('day').valueOf()
      resolver.resolve(
        this.postActions.countPostsWithCal,
        moment(day).year(), moment(day).month() + 1)
    } else {
      date = moment(new Date()).startOf('day').valueOf()
      if (props.post.day) {
        const { day } = props.post
        date = moment(day).startOf('day').valueOf()
        resolver.resolve(
          this.postActions.countPostsWithCal,
          moment(day).year(), moment(day).month() + 1)
      } else {
        resolver.resolve(this.postActions.countPostsWithCal)
      }
    }
    resolver.resolve(this.postActions.fetchList, 0, 10, date, null)
  }

  render () {
    const title = this._T('title.cal')
    const defaultTitle = this._T('title.site')
    const { dispatch } = this.props
    return (
      <DocumentTitle title={title} defaultTitle={defaultTitle}>
        <Cal
          {...bindActionCreators(PostActions, dispatch)}
          {...this.props}
        />
      </DocumentTitle>
    )
  }
}

export default connect(state => ({
  post: state.post
}))(CalHandler)
