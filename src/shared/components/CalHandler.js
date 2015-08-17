import React, { PropTypes } from 'react'
import Cal from './CalComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as PostActions from '../actions/PostActions'
import { updateTitle } from '../actions/LocaleActions'
import DocumentTitle from './addon/document-title'
import moment from 'moment'
import { BaseComponent } from 'shared/components'

@connect(state => ({
  post: state.post
}))
export default class CalHandler extends BaseComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }

  static contextTypes = {
    store: PropTypes.object.isRequired,
    translator: PropTypes.object
  }

  constructor (props, context) {
    super(props, context)
    const date = moment(new Date()).startOf('day').valueOf()
    const { dispatch, resolver } = context.store
    dispatch(updateTitle('title.cal'))

    this.postActions = bindActionCreators(PostActions, dispatch)
    resolver.resolve(this.postActions.countPostsWithCal)
    resolver.resolve(this.postActions.fetchList, 0, 10, date, null, true)
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
          defaultLocale={this.getLocale()}
        />
      </DocumentTitle>
    )
  }
}
