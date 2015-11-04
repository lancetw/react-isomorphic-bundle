import {
  LIST_OG_POST_RELOADED,
  LIST_OG_POST_STARTED,
  LIST_OG_POST_COMPLETED,
  LIST_OG_POST_FAILED
} from 'shared/constants/ActionTypes'
import { createReducer } from 'shared/utils/redux-utils'

const initialState = {
  isFetching: false,
  errors: {},
  data: [],
  oginfo: {},
  offset: 0,
  limit: 0,
  hasMore: true,
  cid: 0
}

export default createReducer(initialState, {
  [LIST_OG_POST_RELOADED]: () => (initialState),
  [LIST_OG_POST_STARTED]: () => ({
    isFetching: true
  }),
  [LIST_OG_POST_COMPLETED]: (state, action) => {
    let hasMore = false
    if (action.data.length === action.limit) {
      hasMore = true
    }
    const data = state.data.concat(action.data)
    return {
      errors: {},
      loading: false,
      data: data,
      oginfo: action.oginfo,
      offset: state.offset + action.limit,
      limit: action.limit,
      hasMore: hasMore,
      cid: action.cid,
      isFetching: false
    }
  },
  [LIST_OG_POST_FAILED]: (state, action) =>
    ({ isFetching: false, errors: action.errors, cid: action.cid })
})
