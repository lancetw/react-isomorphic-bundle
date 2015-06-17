import React from 'react';
import Post from './PostComponent';
import FluxComponent from 'flummox/component';
import auth from './addon/require-auth';

const PostHandler = auth(class PostHandler extends React.Component {
  displayName: 'Post'

  componentWillMount() {
    const pagesActions = this.props.flux.getActions('page');
    pagesActions.setTitle('Post new message');
  }

  render() {
    return (
      <FluxComponent connectToStores={['post']}>
        <Post />
      </FluxComponent>
    );
  }
});

export default PostHandler;
