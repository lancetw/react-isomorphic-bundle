import {
  CHANGE_PASS_USER_STARTED,
  CHANGE_PASS_USER_COMPLETED,
  CHANGE_PASS_USER_FAILED,
  CHANGE_INFO_USER_STARTED,
  CHANGE_INFO_USER_COMPLETED,
  CHANGE_INFO_USER_FAILED,
  GET_INFO_USER_STARTED,
  GET_INFO_USER_COMPLETED,
  GET_INFO_USER_FAILED
} from 'shared/constants/ActionTypes'
import { createReducer } from 'shared/utils/redux-utils'

const initialState = {
  errors: {},
  info: {},
  _info: {}
}

export default createReducer(initialState, {
  [CHANGE_PASS_USER_STARTED]: () => (initialState),
  [CHANGE_PASS_USER_COMPLETED]: (state, action) =>
    ({ _info: action.info }),
  [CHANGE_PASS_USER_FAILED]: (state, action) =>
    ({ errors: action.errors }),
  [CHANGE_INFO_USER_STARTED]: () => (initialState),
  [CHANGE_INFO_USER_COMPLETED]: (state, action) =>
    ({ _info: action.info }),
  [CHANGE_INFO_USER_FAILED]: (state, action) =>
    ({ errors: action.errors }),
  [GET_INFO_USER_STARTED]: () => (initialState),
  [GET_INFO_USER_COMPLETED]: (state, action) =>
    ({ info: action.info }),
  [GET_INFO_USER_FAILED]: (state, action) =>
    ({ errors: action.errors })
})
