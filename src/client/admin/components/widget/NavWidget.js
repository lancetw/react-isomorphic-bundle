import React, { PropTypes } from 'react'

if (process.env.BROWSER) {
}

export default class NavWidget extends React.Component {

  static propTypes = {
    post: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)
  }

  render () {
    return (
      <div className="ui fluid vertical menu">
        <a className="active item">
          <div className="ui teal label">{this.props.post.count}</div>
          佈告列表
        </a>
        <a className="item">
          垃圾文章
        </a>
        <div className="item">
          <div className="ui icon input">
            <input type="text" placeholder="搜尋佈告..." />
            <i className="search icon"></i>
          </div>
        </div>
      </div>
    )
  }
}


