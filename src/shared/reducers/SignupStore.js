import {
  SIGNUP_USER_STARTED,
  SIGNUP_USER_COMPLETED,
  SIGNUP_USER_FAILED,
  GET_SITE_KEY_COMPLETED,
  GET_SITE_KEY_FAILED
} from 'shared/constants/ActionTypes'
import { createReducer } from 'shared/utils/redux-utils'

const initialState = {
  response: {},
  errors: {},
  sitekey: null
}

export default createReducer(initialState, {
  [SIGNUP_USER_STARTED]: () => (initialState),
  [SIGNUP_USER_COMPLETED]: (state, action) =>
    ({ response: action.response, errors: null }),
  [SIGNUP_USER_FAILED]: (state, action) =>
    ({ errors: action.errors }),
  [GET_SITE_KEY_COMPLETED]: (state, action) =>
    ({ sitekey: action.sitekey, errors: null }),
  [GET_SITE_KEY_FAILED]: (state, action) =>
    ({ sitekey: null, errors: action.errors })
})
