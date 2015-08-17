import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { isEmpty } from 'lodash'
import Cards from 'shared/components/wall/PostCards'
import Ad from 'shared/components/addon/ad'
import WallButtons from 'shared/components/wall/WallButtons'

export default class Wall extends React.Component {

  constructor (props) {
    super(props)
  }

  static propTypes = {
    post: PropTypes.object.isRequired,
    loadFunc: PropTypes.func.isRequired
  }

  render () {
    const Translate = require('react-translate-component')
    const { post, loadFunc } = this.props
    const loading = post.loading || false

    return (
      <main className="ui has-header grid container">
        <div className="column">
          <WallButtons />
          <Cards
            posts={post.posts}
            loadFunc={loadFunc}
            hasMore={post.hasMore}
            diff={126}
          />
          {loading && (
            <div className="ui segment basic has-header">
              <div className="ui active inverted dimmer">
                <div className="ui medium indeterminate text loader">
                  <Translate content="wall.loading" />
                </div>
              </div>
            </div>
          )}
          {!loading && isEmpty(post.posts) && (
            <div className="ui segment basic center aligned">
              <Translate content="post.nodata" />
            </div>
          )}
        </div>
      </main>
    )
  }
}
