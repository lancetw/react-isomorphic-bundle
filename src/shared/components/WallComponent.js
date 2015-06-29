import React, { PropTypes } from 'react'
import Cards from 'shared/components/wall/PostCards'
import { isEmpty } from 'lodash'

export default class Wall extends React.Component {

  constructor (props) {
    super(props)
  }

  static propTypes = {
    post: PropTypes.object.isRequired
  }


  render () {
    return (
      <main className="ui stackable page centered grid">
        <div className="column">
          <Cards posts={this.props.post.posts} />
          {isEmpty(this.props.post.posts) && (
            <div className="ui segment basic has-header">
              <div className="ui active inverted dimmer">
                <div className="ui large text loader">Loading</div>
              </div>
            </div>
          )}
        </div>
      </main>
    )
  }
}
