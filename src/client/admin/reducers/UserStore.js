import {
  LIST_USER_RELOADED,
  LIST_USER_STARTED,
  LIST_USER_COMPLETED,
  LIST_USER_FAILED,
  BLOCK_USER_STARTED,
  BLOCK_USER_COMPLETED,
  BLOCK_USER_FAILED,
  CHANGE_PASS_USER_STARTED,
  CHANGE_PASS_USER_COMPLETED,
  CHANGE_PASS_USER_FAILED,
  CHANGE_PASS_USER_INITED,
  CHANGE_USER_STARTED,
  CHANGE_USER_COMPLETED,
  CHANGE_USER_FAILED,
  GET_USER_STARTED,
  GET_USER_COMPLETED,
  GET_USER_FAILED
} from 'client/admin/constants/ActionTypes'
import { createReducer } from 'shared/utils/redux-utils'
import moment from 'moment'
import { merge } from 'lodash'

const initialState = {
  isFetching: false,
  errors: {},
  items: [],
  offset: 0,
  limit: 0,
  hasMore: true,
  start: null,
  end: null,
  count: null,
  blockedCount: null,
  totalPages: null,
  currPage: null,
  done: true,
  keyword: null
}

export default createReducer(initialState, {
  [LIST_USER_RELOADED]: () => ({
    isFetching: false,
    errors: {},
    items: [],
    detail: {},
    offset: 0,
    limit: 0,
    hasMore: true,
    start: null,
    end: null,
    count: null,
    blockedCount: null,
    totalPages: null,
    currPage: null,
    keyword: null
  }),
  [LIST_USER_STARTED]: () => ({
    isFetching: true
  }),
  [LIST_USER_COMPLETED]: (state, action) => {
    let hasMore = false
    if (action.items.length === action.limit) {
      hasMore = true
    }
    const items = action.items
    const o = {
      errors: {},
      items: items,
      offset: state.offset + action.limit,
      limit: action.limit,
      hasMore: hasMore,
      start: action.start,
      end: action.end,
      isFetching: false,
      totalPages: Math.ceil(+action.count / +action.limit),
      currPage: Math.ceil(+(state.offset + action.limit) / +action.limit),
      done: true,
      keyword: action.keyword,
      user: null
    }
    if (action.status === 0) {
      return merge(o, { count: action.count, blockedCount: null })
    } else {
      return merge(o, { blockedCount: action.count })
    }
  },
  [LIST_USER_FAILED]: (state, action) =>
    ({ done: true, isFetching: false, errors: action.errors }),
  [BLOCK_USER_STARTED]: () =>
    ({ done: false }),
  [BLOCK_USER_COMPLETED]: (state, action) =>
    ({ done: false }),
  [BLOCK_USER_FAILED]: (state, action) =>
    ({ done: false, errors: action.errors }),
  [GET_USER_STARTED]: () =>
    ({ detail: {} }),
  [GET_USER_COMPLETED]: (state, action) =>
    ({ detail: action.detail }),
  [GET_USER_FAILED]: (state, action) =>
    ({ errors: action.errors }),
  [CHANGE_PASS_USER_STARTED]: () =>
    ({ user: null }),
  [CHANGE_PASS_USER_COMPLETED]: (state, action) =>
    ({ user: action.user }),
  [CHANGE_PASS_USER_FAILED]: (state, action) =>
    ({ errors: action.errors })
})
