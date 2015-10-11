import {
  SEARCH_POST_RELOADED,
  SEARCH_POST_STARTED,
  SEARCH_POST_COMPLETED,
  SEARCH_POST_FAILED,
  SEARCH_NEARBY_RELOADED,
  SEARCH_NEARBY_STARTED,
  SEARCH_NEARBY_COMPLETED,
  SEARCH_NEARBY_FAILED,
  SEARCH_UPDATE_CENTER_COMPLETED
} from 'shared/constants/ActionTypes'
import { createReducer } from 'shared/utils/redux-utils'
import { isEmpty } from 'lodash'

const initialState = {
  errors: {},
  pattern: '',
  data: [],
  isFetching: false,
  hasMore: true,
  offset: 0,
  limit: 0,
  center: { lat: null, lng: null}
}

export default createReducer(initialState, {
  [SEARCH_POST_RELOADED]: () => (initialState),
  [SEARCH_POST_STARTED]: () => ({
    isFetching: true
  }),
  [SEARCH_POST_COMPLETED]: (state, action) => {
    let hasMore = false
    let data = state.data
    if (action.data) {
      if (action.data.length === action.limit) {
        hasMore = true
      }
      data = state.data.concat(action.data)
    }

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
  },
  [SEARCH_NEARBY_RELOADED]: () => (initialState),
  [SEARCH_NEARBY_STARTED]: () => ({
    isFetching: true
  }),
  [SEARCH_NEARBY_COMPLETED]: (state, action) => {
    return {
      errors: {},
      hasMore: false,
      isFetching: false,
      data: action.data,
      limit: action.limit,
      pattern: action.pattern
    }
  },
  [SEARCH_NEARBY_FAILED]: (state, action) => {
    return {
      errors: action.errors,
      isFetching: false,
      hasMore: false,
      pattern: action.pattern
    }
  },
  [SEARCH_UPDATE_CENTER_COMPLETED]: (state, action) => {
    return {
      center: action.center
    }
  }
})
