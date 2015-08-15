import {
  SEARCH_POST_STARTED,
  SEARCH_POST_COMPLETED,
  SEARCH_POST_FAILED
} from 'shared/constants/ActionTypes'
import { createReducer } from 'shared/utils/redux-utils'

const initialState = {
  errors: {},
  pattern: '',
  data: [],
  loading: true,
  hasMore: false
}

export default createReducer(initialState, {
  [SEARCH_POST_STARTED]: () => (initialState),
  [SEARCH_POST_COMPLETED]: (state, action) => {
    let hasMore = false
    if (action.data.length > 0)
      hasMore = true
    const data = state.data.concat(action.data)
    return {
      errors: {},
      loading: false,
      data: data,
      offset: action.offset,
      limit: action.limit,
      hasMore: hasMore,
      pattern: action.pattern
    }
  },
  [SEARCH_POST_FAILED]: (state, action) => {
    return {
      errors: action.errors,
      loading: false,
      data: [],
      offset: action.offset,
      limit: action.limit,
      hasMore: false,
      pattern: ''
    }
  }
})
