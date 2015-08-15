import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { isEmpty } from 'lodash'
import Cards from 'shared/components/wall/PostCards'

export default class Search extends React.Component {

  constructor (props) {
    super(props)
  }

  static propTypes = {
    loadFunc: PropTypes.func.isRequired,
    searchPost: PropTypes.func.isRequired,
    search: PropTypes.object.isRequired
  }

  render () {
    const Translate = require('react-translate-component')
    const { searchPost, search, loadFunc } = this.props
    const loading = search.loading || false

    return (
      <main className="ui stackable page grid">
        <div className="column">
          <div className="row">
            <h1>搜尋「{search.pattern}」的結果</h1>
          </div>
          <div className="row">
            {!isEmpty(search.data) && (
              <Cards
                posts={search.data}
                loadFunc={loadFunc}
                hasMore={search.hasMore}
                diff={126}
              />
            )}
            {loading && (
              <div className="ui segment basic has-header">
                <div className="ui active inverted dimmer">
                  <div className="ui medium indeterminate text loader">
                    <Translate content="wall.loading" />
                  </div>
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
