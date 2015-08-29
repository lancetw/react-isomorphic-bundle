import {
  CREATE_POST_STARTED,
  CREATE_POST_COMPLETED,
  CREATE_POST_FAILED,
  UPDATE_POST_STARTED,
  UPDATE_POST_COMPLETED,
  UPDATE_POST_FAILED,
  REMOVE_POST_STARTED,
  REMOVE_POST_COMPLETED,
  REMOVE_POST_FAILED,
  SHOW_POST_STARTED,
  SHOW_POST_COMPLETED,
  SHOW_POST_FAILED,
  LIST_POST_RELOADED,
  LIST_POST_STARTED,
  LIST_POST_COMPLETED,
  LIST_POST_FAILED,
  COUNT_POST_IN_MONTH_STARTED,
  COUNT_POST_IN_MONTH_COMPLETED,
  COUNT_POST_IN_MONTH_FAILED
} from 'shared/constants/ActionTypes'
import { createReducer } from 'shared/utils/redux-utils'

const initialState = {
  isFetching: false,
  errors: {},
  posts: [],
  offset: 0,
  limit: 0,
  hasMore: true,
  content: {},
  count: [],
  countStart: [],
  detail: {},
  year: null,
  month: null,
  start: null,
  end: null
}

export default createReducer(initialState, {
  [CREATE_POST_STARTED]: () => (initialState),
  [CREATE_POST_COMPLETED]: (state, action) =>
    ({ content: action.content }),
  [CREATE_POST_FAILED]: (state, action) =>
    ({ errors: action.errors }),
  [UPDATE_POST_STARTED]: () => (initialState),
  [UPDATE_POST_COMPLETED]: (state, action) =>
    ({ content: action.content }),
  [UPDATE_POST_FAILED]: (state, action) =>
    ({ errors: action.errors }),
  [REMOVE_POST_STARTED]: () => (initialState),
  [REMOVE_POST_COMPLETED]: (state, action) =>
    ({ content: action.content }),
  [REMOVE_POST_FAILED]: (state, action) =>
    ({ errors: action.errors }),
  [SHOW_POST_STARTED]: () => ({
    isFetching: true,
    detail: {}
  }),
  [SHOW_POST_COMPLETED]: (state, action) => ({
    errors: {},
    detail: action.detail,
    isFetching: false
  }),
  [SHOW_POST_FAILED]: (state, action) => ({
    errors: action.errors,
    isFetching: false
  }),
  [LIST_POST_RELOADED]: () => (initialState),
  [LIST_POST_STARTED]: () => ({
    isFetching: true
  }),
  [LIST_POST_COMPLETED]: (state, action) => {
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
      start: action.start,
      end: action.end,
      isFetching: false
    }
  },
  [LIST_POST_FAILED]: (state, action) =>
    ({ isFetching: false, errors: action.errors }),
  [COUNT_POST_IN_MONTH_STARTED]: () => ({ count: [], countStart: [] }),
  [COUNT_POST_IN_MONTH_COMPLETED]: (state, action) =>
    ({
      count: action.cals.count,
      countStart: action.cals.countStart,
      year: action.year,
      month: action.month
    }),
  [COUNT_POST_IN_MONTH_FAILED]: (state, action) =>
    ({ errors: action.errors })
})
