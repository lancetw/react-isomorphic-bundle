import {
  LIST_OVERVIEW_POST_RELOADED,
  LIST_OVERVIEW_POST_STARTED,
  LIST_OVERVIEW_POST_COMPLETED,
  LIST_OVERVIEW_POST_FAILED,
} from 'shared/constants/ActionTypes'
import { createReducer } from 'shared/utils/redux-utils'

const initialState = {
  isFetching: false,
  errors: {},
  posts: [],
  offset: 0,
  limit: 0,
  hasMore: true
}

export default createReducer(initialState, {
  [LIST_OVERVIEW_POST_RELOADED]: () => ({
    posts: [],
    errors: {},
    offset: 0,
    limit: 0,
    isFetching: false
  }),
  [LIST_OVERVIEW_POST_STARTED]: () => ({
    isFetching: true
  }),
  [LIST_OVERVIEW_POST_COMPLETED]: (state, action) => {
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
      hasMore: hasMore,
      isFetching: false
    }
  },
  [LIST_OVERVIEW_POST_FAILED]: (state, action) =>
    ({ isFetching: false, errors: action.errors })
})
