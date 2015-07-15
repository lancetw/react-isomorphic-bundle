export default () => {
  return next => action => {
    return isPromise(action)
      ? action.then(next)
      : next(action)
  }
}

function isPromise (val) {
  return val && typeof val.then === 'function'
}
