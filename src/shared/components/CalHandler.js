import React, { PropTypes } from 'react'
import Cal from './CalComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as PostActions from '../actions/PostActions'
import { updateTitle } from '../actions/LocaleActions'
import Helmet from 'react-helmet'
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

  constructor (props) {
    super(props)
  }

  componentWillMount () {
    const { dispatch } = this.props
    const { store: { resolver } } = this.context

    dispatch(updateTitle('title.cal'))
    this.postActions = bindActionCreators(PostActions, dispatch)

    const { query } = this.props.location
    let date
    if (query && query.day) {
      const { day } = query
      date = moment(day).startOf('day').valueOf()
      resolver.resolve(
        this.postActions.countPostsWithCal,
        moment(day).year(), moment(day).month() + 1)
    } else {
      date = moment(new Date()).startOf('day').valueOf()
      if (this.props.post.day) {
        const { day } = this.props.post
        date = moment(day).startOf('day').valueOf()
        resolver.resolve(
          this.postActions.countPostsWithCal,
          moment(day).year(), moment(day).month() + 1)
      } else {
        resolver.resolve(this.postActions.countPostsWithCal)
      }
    }
    resolver.resolve(this.postActions.fetchList, 0, 20, date, null)
  }

  componentDidUpdate () {
    _jf.flush()
  }

  render () {
    const title = this._T('title.cal')
    const defaultTitle = this._T('title.site')
    const { dispatch } = this.props
    return (
      <div>
        <Helmet title={`${title} | ${defaultTitle}`} />
        <Cal
          {...bindActionCreators(PostActions, dispatch)}
          {...this.props} />
      </div>
    )
  }
}

export default connect(state => ({
  post: state.post
}))(CalHandler)
