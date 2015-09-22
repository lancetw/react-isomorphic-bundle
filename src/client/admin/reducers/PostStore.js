import {
  LIST_POST_RELOADED,
  LIST_POST_STARTED,
  LIST_POST_COMPLETED,
  LIST_POST_FAILED
} from 'client/admin/constants/ActionTypes'
import { createReducer } from 'shared/utils/redux-utils'
import moment from 'moment'

const initialState = {
  isFetching: false,
  errors: {},
  posts: [],
  offset: 0,
  limit: 0,
  hasMore: true,
  start: null,
  end: null,
  count: null,
  totalPages: null,
  currPage: null
}

export default createReducer(initialState, {
  [LIST_POST_RELOADED]: () => ({
    isFetching: false,
    errors: {},
    posts: [],
    offset: 0,
    limit: 0,
    hasMore: true,
    start: null,
    end: null,
    count: null,
    totalPages: null,
    currPage: null
  }),
  [LIST_POST_STARTED]: () => ({
    isFetching: true
  }),
  [LIST_POST_COMPLETED]: (state, action) => {
    let hasMore = false
    if (action.posts.length === action.limit) {
      hasMore = true
    }
    const posts = action.posts
    return {
      errors: {},
      loading: false,
      posts: posts,
      offset: state.offset + action.limit,
      limit: action.limit,
      hasMore: hasMore,
      start: action.start,
      end: action.end,
      isFetching: false,
      count: action.count,
      totalPages: Math.floor(+action.count / +action.limit),
      currPage: Math.floor(+(state.offset + action.limit) / +action.limit)
    }
  },
  [LIST_POST_FAILED]: (state, action) =>
    ({ isFetching: false, errors: action.errors })
})
