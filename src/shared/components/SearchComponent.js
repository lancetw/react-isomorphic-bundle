import React, { Component, PropTypes } from 'react'
import { isEmpty } from 'lodash'
import Cards from 'shared/components/wall/PostCards'
import counterpart from 'counterpart'
import { tongwenAutoStr } from 'shared/utils/tongwen'

export default class Search extends Component {

  static propTypes = {
    loadFunc: PropTypes.func.isRequired,
    search: PropTypes.object.isRequired,
    defaultLocale: PropTypes.string.isRequired
  }

  constructor (props) {
    super(props)
  }

  render () {
    const Translate = require('react-translate-component')
    const { search, loadFunc } = this.props
    const loading = !!search.isFetching

    return (
      <main className="ui has-header grid centered container">
        <div className="sixteen wide tablet twelve wide computer column">
          <div className="row">
            {search.pattern
              && (<h4>
                <Translate
                  content="search.title"
                  keyword={tongwenAutoStr(search.pattern, this.props.defaultLocale)}/>
              </h4>)}
          </div>
          <div className="row">
            <Cards
              posts={search.data}
              loadFunc={loadFunc}
              hasMore={search.hasMore}
              isFetching={loading}
              diff={118}
              defaultLocale={this.props.defaultLocale}
            />
            {loading && isEmpty(search.data) && (
              <div className="ui segment basic has-header">
                <div className="ui active inverted dimmer">
                  <div className="ui text loader"></div>
                </div>
              </div>
            )}
            {!loading && isEmpty(search.data) && (
              <div className="ui segment basic center aligned">
                <Translate content="search.nodata" />
              </div>
            )}
          </div>
        </div>
      </main>
    )
  }
}
