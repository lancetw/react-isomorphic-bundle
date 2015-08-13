import {
  SIGNUP_USER_STARTED,
  SIGNUP_USER_COMPLETED,
  SIGNUP_USER_FAILED
} from 'shared/constants/ActionTypes'
import { createReducer } from 'shared/utils/redux-utils'

const initialState = {
  response: {},
  errors: {}
}

export default createReducer(initialState, {
  [SIGNUP_USER_STARTED]: () => (initialState),
  [SIGNUP_USER_COMPLETED]: (state, action) =>
    ({ response: action.response }),
  [SIGNUP_USER_FAILED]: (state, action) =>
    ({ errors: action.errors })
})
