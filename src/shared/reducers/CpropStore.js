import {
  LIST_CPROP_POST_RELOADED,
  LIST_CPROP_POST_STARTED,
  LIST_CPROP_POST_COMPLETED,
  LIST_CPROP_POST_FAILED
} from 'shared/constants/ActionTypes'
import { createReducer } from 'shared/utils/redux-utils'

const initialState = {
  isFetching: false,
  errors: {},
  posts: [],
  offset: 0,
  limit: 0,
  hasMore: true,
  cprop: ''
}

export default createReducer(initialState, {
  [LIST_CPROP_POST_RELOADED]: () => (initialState),
  [LIST_CPROP_POST_STARTED]: () => ({
    isFetching: true
  }),
  [LIST_CPROP_POST_COMPLETED]: (state, action) => {
    let hasMore = false
    if (action.posts.length === action.limit) {
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
      cprop: action.cprop,
      isFetching: false
    }
  },
  [LIST_CPROP_POST_FAILED]: (state, action) =>
    ({ isFetching: false, errors: action.errors, cprop: action.cprop })
})
