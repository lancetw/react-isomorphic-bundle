import {
  CHANGE_PASS_USER_STARTED,
  CHANGE_PASS_USER_COMPLETED,
  CHANGE_PASS_USER_FAILED
} from 'shared/constants/ActionTypes'
import { createReducer } from 'shared/utils/redux-utils'

const initialState = {
  errors: {},
  info: {}
}

export default createReducer(initialState, {
  [CHANGE_PASS_USER_STARTED]: () => (initialState),
  [CHANGE_PASS_USER_COMPLETED]: (state, action) =>
    ({ info: action.info }),
  [CHANGE_PASS_USER_FAILED]: (state, action) =>
    ({ errors: action.errors })
})
