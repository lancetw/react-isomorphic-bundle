import React, { PropTypes } from 'react'
import Search from './SearchComponent'
import { connect } from 'react-redux'
import * as SearchActions from '../actions/SearchActions'
import { updateTitle } from '../actions/LocaleActions'
import DocumentTitle from './addon/document-title'
import { BaseComponent } from 'shared/components'

@connect(state => ({
  search: state.search
}))
export default class SearchHandler extends BaseComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    search: PropTypes.object.isRequired
  }

  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  constructor (props, context) {
    super(props)
    const { dispatch } = context.store
    dispatch(updateTitle('title.search'))
  }

  loadFunc () {
    const { dispatch, search } = this.props

    dispatch(SearchActions
      .searchPost(search.pattern, search.offset, search.limit))
  }

  render () {
    const title = this._T('title.search')
    const defaultTitle = this._T('title.site')

    return (
      <DocumentTitle title={title} defaultTitle={defaultTitle}>
        <Search
          {...this.props}
          defaultLocale={this.getLocale()}
          loadFunc={::this.loadFunc}
        />
      </DocumentTitle>
    )
  }
}
