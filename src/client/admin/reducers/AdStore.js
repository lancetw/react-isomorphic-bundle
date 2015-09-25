import {
  LIST_AD_RELOADED,
  LIST_AD_STARTED,
  LIST_AD_COMPLETED,
  LIST_AD_FAILED
} from 'client/admin/constants/ActionTypes'
import { createReducer } from 'shared/utils/redux-utils'
import moment from 'moment'

const initialState = {
  isFetching: false,
  errors: {},
  items: [],
  offset: 0,
  limit: 0,
  hasMore: true,
  count: null,
  totalPages: null,
  currPage: null,
  done: true
}

export default createReducer(initialState, {
  [LIST_AD_RELOADED]: () => ({
    isFetching: false,
    errors: {},
    items: [],
    offset: 0,
    limit: 0,
    hasMore: true,
    count: null,
    totalPages: null,
    currPage: null
  }),
  [LIST_AD_STARTED]: () => ({
    isFetching: true
  }),
  [LIST_AD_COMPLETED]: (state, action) => {
    let hasMore = false
    if (action.items.length === action.limit) {
      hasMore = true
    }
    const items = action.items
    return {
      errors: {},
      items: items,
      offset: state.offset + action.limit,
      limit: action.limit,
      hasMore: hasMore,
      isFetching: false,
      totalPages: Math.ceil(+action.count / +action.limit),
      currPage: Math.ceil(+(state.offset + action.limit) / +action.limit),
      done: true,
      count: action.count
    }
  },
  [LIST_AD_FAILED]: (state, action) =>
    ({ done: true, isFetching: false, errors: action.errors })
})
