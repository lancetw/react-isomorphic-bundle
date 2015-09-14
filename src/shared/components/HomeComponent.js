import React, { PropTypes } from 'react'
import { BaseComponent } from 'shared/components'
import { Link } from 'react-router'
import { isEmpty } from 'lodash'

export default class HomeComponent extends BaseComponent {

  static propTypes = {
    auth: PropTypes.object.isRequired,
    post: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)
  }

  renderNews (posts) {
    if (!isEmpty(posts)) {
      const self = this
      return posts.map(function (post) {
        return self.renderItem(post)
      })
    } else {
      return <div></div>
    }
  }

  renderItem (post) {
    const Translate = require('react-translate-component')
    return (
    <div key={post.id} className="ui orange icon message">
      <img className="icon" src={`images/ccnda_icon_mini.jpg`} alt="" />
      <div className="content">
        <h3>
          <Link to={`/wall/posts/${post.id}`}>
            {post.ocname || <Translate content="news.unnamed" />}
          </Link>
        </h3>
        <div className="header">
          {post.title}
        </div>
      </div>
    </div>
    )
  }

  render () {
    const Translate = require('react-translate-component')
    const TranslateProps = React.createFactory(Translate)
    const tokenProps = {
      component: 'input',
      type: 'text',
      name: 'token',
      scope: 'home_token',
      readOnly: true,
      attributes: {
        placeholder: 'placeholder'
      },
      value: this.props.auth.token
    }

    const { user } = this.props.auth
    const { posts } = this.props.post
    const loading = this.props.post.isFetching

    return (
      <main className="ui column centered stackable page grid">
        <div className="column">
          { ::this.renderNews(posts) }
          {loading && isEmpty(posts) && (
            <div className="ui segment basic has-header">
              <div className="ui active inverted dimmer">
                <div className="ui indeterminate text loader">
                  <Translate content="wall.loading" />
                </div>
              </div>
            </div>
          )}
          {!loading && isEmpty(posts) && (
            <div>
              <div className="ui hidden divider"></div>
              <div className="ui segment basic has-header center aligned">
                <Translate content="post.nodata" />
              </div>
            </div>
          )}
          <div className="ui basic segment center">
            <h3>
              <a href="http://www.ccnda.org" target="_blank">
                <p>中華基督教網路發展協會</p>
                <img src={`images/ccnda_icon.jpg`} alt="" />
              </a>
            </h3>
          </div>
        </div>
      </main>
    )
  }
}
