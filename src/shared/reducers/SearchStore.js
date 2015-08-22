import {
  SEARCH_POST_RELOADED,
  SEARCH_POST_STARTED,
  SEARCH_POST_COMPLETED,
  SEARCH_POST_FAILED
} from 'shared/constants/ActionTypes'
import { createReducer } from 'shared/utils/redux-utils'

const initialState = {
  errors: {},
  pattern: '',
  data: [],
  isFetching: false,
  hasMore: true,
  offset: 0,
  limit: 0
}

export default createReducer(initialState, {
  [SEARCH_POST_RELOADED]: () => ({
    errors: {},
    data: [],
    offset: 0,
    limit: 0
  }),
  [SEARCH_POST_STARTED]: () => ({
    isFetching: true
  }),
  [SEARCH_POST_COMPLETED]: (state, action) => {
    let hasMore = false
    if (action.data.length === action.limit) {
      hasMore = true
    }
    const data = state.data.concat(action.data)
    return {
      errors: {},
      isFetching: false,
      data: data,
      offset: state.offset + action.limit,
      limit: action.limit,
      hasMore: hasMore,
      pattern: action.pattern
    }
  },
  [SEARCH_POST_FAILED]: (state, action) => {
    return {
      errors: action.errors,
      isFetching: false,
      hasMore: false,
      pattern: action.pattern
    }
  }
})
