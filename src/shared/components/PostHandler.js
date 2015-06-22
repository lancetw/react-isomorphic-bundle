import React, { PropTypes } from 'react'
import Post from './PostComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'redux/react'
import * as PostActions from '../actions/PostActions'
import DocumentTitle from './addon/document-title'

@connect(state => ({
  post: state.post
}))
export default class PostHandler extends React.Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }

  render () {
    const { dispatch } = this.props
    return (
      <DocumentTitle title='Post it!'>
        <Post
          {...bindActionCreators(PostActions, dispatch)}
          {...this.props}
        />
      </DocumentTitle>
    )
  }

}
