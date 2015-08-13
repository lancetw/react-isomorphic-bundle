// borrow from react-redux-starter-kit
// https://github.com/davezuko/react-redux-starter-kit

export function createConstants (...constants) {
  return constants.reduce((acc, constant) => {
    return Object.assign({}, acc, { [constant]: constant })
  }, {})
}

export function createReducer (initialState, reducerMap) {
  return (state = initialState, action) => {
    const reducer = reducerMap[action.type]

    return reducer ? Object.assign({}, state, reducer(state, action)) : state
  }
}
