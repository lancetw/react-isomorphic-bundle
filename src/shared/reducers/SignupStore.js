import {
  SIGNUP_USER_STARTED,
  SIGNUP_USER_COMPLETED,
  SIGNUP_USER_FAILED
} from 'shared/constants/ActionTypes'

const initialState = {
  response: {},
  errors: {}
}

const actionsMap = {
  [SIGNUP_USER_STARTED]: () => (initialState),
  [SIGNUP_USER_COMPLETED]: (state, action) =>
    ({ response: action.response }),
  [SIGNUP_USER_FAILED]: (state, action) =>
    ({ errors: action.errors })
}

export default function signup (state = initialState, action) {
  const reduceFn = actionsMap[action.type]
  if (!reduceFn) return state

  return Object.assign({}, state, reduceFn(state, action))
}
