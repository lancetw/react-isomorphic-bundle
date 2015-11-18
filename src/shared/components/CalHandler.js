import React, { Component, PropTypes } from 'react'
import Cal from './CalComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as PostActions from '../actions/PostActions'
import { updateTitle } from '../actions/LocaleActions'
import Helmet from 'react-helmet'
import moment from 'moment'
import queryString from 'query-string'
import connectI18n from 'shared/components/addon/connect-i18n'

class CalHandler extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    post: PropTypes.object.isRequired,
    _T: PropTypes.func.isRequired
  }

  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)
  }

  componentWillMount () {
    const { dispatch, location } = this.props
    const { store: { resolver, query } } = this.context

    dispatch(updateTitle('title.cal'))
    this.postActions = bindActionCreators(PostActions, dispatch)

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

  render () {
    const { dispatch, _T } = this.props
    const title = _T('title.cal')
    const defaultTitle = _T('title.site')
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
}))(connectI18n()(CalHandler))
