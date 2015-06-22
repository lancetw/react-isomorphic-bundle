import { CHANGE_PASS_USER_STARTED, CHANGE_PASS_USER_COMPLETED,
  CHANGE_PASS_USER_FAILED } from 'shared/constants/ActionTypes'

const initialState = {
  errors: {},
  info: {}
}

const actionsMap = {
  [CHANGE_PASS_USER_STARTED]: () => (initialState),
  [CHANGE_PASS_USER_COMPLETED]: (state, action) =>
    ({ info: action.info }),
  [CHANGE_PASS_USER_FAILED]: (state, action) =>
    ({ errors: action.errors })
}

export default function user (state = initialState, action) {
  const reduceFn = actionsMap[action.type]
  if (!reduceFn) return state

  return Object.assign({}, state, reduceFn(state, action))
}
