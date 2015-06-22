import React, { PropTypes } from 'react'
import Cards from 'shared/components/wall/PostCards'

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
        </div>
      </main>
    )
  }
}
