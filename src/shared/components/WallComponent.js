import React, { PropTypes } from 'react'
import { isEmpty } from 'lodash'
import Cards from 'shared/components/wall/PostCards'
import WallButtons from 'shared/components/wall/WallButtons'

export default class Wall extends React.Component {

  static propTypes = {
    post: PropTypes.object.isRequired,
    loadFunc: PropTypes.func.isRequired,
    defaultLocale: PropTypes.string.isRequired
  }

  constructor (props) {
    super(props)
  }

  render () {
    const Translate = require('react-translate-component')
    const { post, loadFunc } = this.props
    const loading = post.isFetching || false

    return (
      <main className="ui has-header grid container">
        <div className="column">
          <WallButtons />
          <Cards
            posts={post.posts}
            loadFunc={loadFunc}
            hasMore={post.hasMore}
            isFetching={loading}
            diff={127}
            defaultLocale={this.props.defaultLocale}
          />
          {loading && isEmpty(post.posts) && (
            <div className="ui segment basic has-header">
              <div className="ui active inverted dimmer">
                <div className="ui indeterminate text loader">
                  <Translate content="wall.loading" />
                </div>
              </div>
            </div>
          )}
          {!loading && isEmpty(post.posts) && (
            <div>
              <div className="ui hidden divider"></div>
              <div className="ui segment basic has-header center aligned">
                <Translate content="post.nodata" />
              </div>
            </div>
          )}
        </div>
      </main>
    )
  }
}
