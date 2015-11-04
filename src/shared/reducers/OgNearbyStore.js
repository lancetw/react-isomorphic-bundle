import {
  LIST_OG_POST_NEARBY_RELOADED,
  LIST_OG_POST_NEARBY_STARTED,
  LIST_OG_POST_NEARBY_COMPLETED,
  LIST_OG_POST_NEARBY_FAILED
} from 'shared/constants/ActionTypes'
import { createReducer } from 'shared/utils/redux-utils'

const initialState = {
  isFetching: false,
  errors: {},
  limit: 0,
  hasMore: true,
  oginfo: {},
  cid: 0,
  pattern: '',
  data: [],
  center: { lat: null, lng: null}
}

export default createReducer(initialState, {
  [LIST_OG_POST_NEARBY_RELOADED]: () => (initialState),
  [LIST_OG_POST_NEARBY_STARTED]: () => ({
    isFetching: true
  }),
  [LIST_OG_POST_NEARBY_COMPLETED]: (state, action) => {
    let hasMore = false
    if (action.data.length === action.limit) {
      hasMore = true
    }

    return {
      errors: {},
      content: {},
      loading: false,
      data: action.data,
      limit: action.limit,
      hasMore: hasMore,
      oginfo: action.oginfo,
      cid: action.cid,
      pattern: action.pattern,
      isFetching: false
    }
  },
  [LIST_OG_POST_NEARBY_FAILED]: (state, action) =>
    ({ isFetching: false, errors: action.errors, cid: action.cid })
})
