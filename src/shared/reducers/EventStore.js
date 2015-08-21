import {
  EVENT_SCROLL_POSITION_RELOADED,
  EVENT_SCROLL_POSITION_STARTED,
  EVENT_SCROLL_POSITION_COMPLETED,
  EVENT_SCROLL_POSITION_FAILED
} from 'shared/constants/ActionTypes'
import { createReducer } from 'shared/utils/redux-utils'

const initialState = {
  errors: {}
}

export default createReducer(initialState, {
  [EVENT_SCROLL_POSITION_RELOADED]: () => (initialState),
  [EVENT_SCROLL_POSITION_STARTED]: () => ({ errors: {} }),
  [EVENT_SCROLL_POSITION_COMPLETED]: (state, action) =>
    ({
      [action.store]: { scrollTop: action.scrollTop },
      errors: {}
    }),
  [EVENT_SCROLL_POSITION_FAILED]: (state, action) =>
    ({ errors: action.errors })
})
