import React, { PropTypes } from 'react'
import { isEmpty } from 'lodash'
import Cards from 'shared/components/wall/PostCards'

export default class Search extends React.Component {

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
      <main className="ui stackable page grid">
        <div className="column">
          <div className="row">
            {search.pattern
              && (<h1>
                <Translate content="search.title" keyword={search.pattern}/>
              </h1>)}
          </div>
          <div className="row">
            <Cards
              posts={search.data}
              loadFunc={loadFunc}
              hasMore={search.hasMore}
              isFetching={loading}
              diff={126}
              defaultLocale={this.props.defaultLocale}
            />
            {loading && isEmpty(search.data) && (
              <div className="ui segment basic has-header">
                <div className="ui active inverted dimmer">
                  <div className="ui large text loader">
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
