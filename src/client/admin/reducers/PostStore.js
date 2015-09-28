import {
  LIST_POST_RELOADED,
  LIST_POST_STARTED,
  LIST_POST_COMPLETED,
  LIST_POST_FAILED,
  MARK_AS_SPAM_STARTED,
  MARK_AS_SPAM_COMPLETED,
  MARK_AS_SPAM_FAILED
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
  spamCount: null,
  totalPages: null,
  currPage: null,
  done: true,
  keyword: null
}

export default createReducer(initialState, {
  [LIST_POST_RELOADED]: () => ({
    isFetching: false,
    errors: {},
    items: [],
    offset: 0,
    limit: 0,
    hasMore: true,
    start: null,
    end: null,
    count: null,
    spamCount: null,
    totalPages: null,
    currPage: null,
    keyword: null
  }),
  [LIST_POST_STARTED]: () => ({
    isFetching: true,
  }),
  [LIST_POST_COMPLETED]: (state, action) => {
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
      keyword: action.keyword
    }
    if (action.status === 0) {
      return merge(o, { count: action.count, spamCount: null })
    } else {
      return merge(o, { spamCount: action.count })
    }
  },
  [LIST_POST_FAILED]: (state, action) =>
    ({ done: true, isFetching: false, errors: action.errors }),
  [MARK_AS_SPAM_STARTED]: () =>
    ({ done: false }),
  [MARK_AS_SPAM_COMPLETED]: (state, action) =>
    ({ done: false }),
  [MARK_AS_SPAM_FAILED]: (state, action) =>
    ({ done: false, errors: action.errors })
})
