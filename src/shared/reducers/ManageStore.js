import {
  LIST_MANAGE_POST_RELOADED,
  LIST_MANAGE_POST_STARTED,
  LIST_MANAGE_POST_COMPLETED,
  LIST_MANAGE_POST_FAILED,
} from 'shared/constants/ActionTypes'
import { createReducer } from 'shared/utils/redux-utils'

const initialState = {
  isFetching: false,
  errors: {},
  posts: [],
  offset: 0,
  limit: 0,
  hasMore: false
}

export default createReducer(initialState, {
  [LIST_MANAGE_POST_RELOADED]: () => ({
    posts: [],
    errors: {},
    offset: 0,
    limit: 0
  }),
  [LIST_MANAGE_POST_STARTED]: () => ({
    isFetching: true
  }),
  [LIST_MANAGE_POST_COMPLETED]: (state, action) => {
    let hasMore = false
    if (action.posts.length > 0) {
      hasMore = true
    }
    const posts = state.posts.concat(action.posts)
    return {
      errors: {},
      content: {},
      loading: false,
      posts: posts,
      offset: state.offset + action.limit,
      limit: action.limit,
      hasMore: hasMore
    }
  },
  [LIST_MANAGE_POST_FAILED]: (state, action) =>
    ({ isFetching: false, errors: action.errors })
})
