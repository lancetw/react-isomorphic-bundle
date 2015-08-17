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
    store: PropTypes.object.isRequired,
    translator: PropTypes.object
  }

  constructor (props, context) {
    super(props, context)
    const { dispatch } = context.store
    dispatch(updateTitle('title.search'))

    this.state = { limit: 10, nextOffset: 0 }
  }

  render () {
    const title = this._T('title.search')
    const defaultTitle = this._T('title.site')

    return (
      <DocumentTitle title={title} defaultTitle={defaultTitle}>
        <Search
          {...this.props}
          loadFunc={::this.loadFunc}
        />
      </DocumentTitle>
    )
  }

  loadFunc () {
    const { dispatch, search } = this.props
    const nextOffset = this.state.nextOffset + this.state.limit
    dispatch(SearchActions
      .searchPost(search.pattern, nextOffset - 1, this.state.limit))

    this.setState({ nextOffset: nextOffset })
  }

}
