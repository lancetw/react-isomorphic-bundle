import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { isEmpty } from 'lodash'
import Cards from 'shared/components/wall/PostCards'
import Ad from 'shared/components/addon/ad'

export default class Manage extends React.Component {

  constructor (props) {
    super(props)
  }

  static propTypes = {
    post: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    loadFunc: PropTypes.func.isRequired
  }

  render () {
    const Translate = require('react-translate-component')
    const { post, auth, loadFunc } = this.props
    const loading = post.loading || false
    const { user } = auth
    return (
      <main className="ui stackable page grid">
        <div className="column">
          <div className="row">
            <h1>{user.email} 發表的佈告</h1>
          </div>
          <div className="row">
            {!isEmpty(post.posts) && (
              <Cards
                posts={post.posts}
                loadFunc={loadFunc}
                hasMore={post.hasMore}
                diff={126}
              />
            )}
            {loading && (
              <div className="ui segment basic has-header">
                <div className="ui active inverted dimmer">
                  <div className="ui large text loader">
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
        </div>
      </main>
    )
  }
}
