import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { isEmpty } from 'lodash'
import Cards from 'shared/components/wall/PostCards'

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

    return (
      <main className="ui stackable page centered grid">
        <div className="column">
          <div className="row">
            <div className="ui orange inverted buttons">
              <Link className="ui button" to='/wall/today'>
                <Translate content="header.wall" />
              </Link>
              <Link className="ui button" to='/wall/cal'>
                <Translate content="header.cal" />
              </Link>
            </div>
          </div>
          <div className="ui horizontal divider" />
          <div className="row">
            <Cards
              posts={this.props.post.posts}
              loadFunc={this.props.loadFunc}
              hasMore={this.props.post.hasMore}
            />
            {this.props.post.loading && (
              <div className="ui segment basic has-header">
                <div className="ui active inverted dimmer">
                  <div className="ui large text loader">
                    <Translate content="wall.loading" />
                  </div>
                </div>
              </div>
            )}
            {isEmpty(this.props.post.posts) && (
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
