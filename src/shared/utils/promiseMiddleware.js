function onError (err) {
  setTimeout(function () {
    throw err
  }, 0)
}

function isPromise (val) {
  return val && typeof val.then === 'function'
}

module.exports = () => {
  return next => action => {
    return isPromise(action)
      ? action.then(next, onError)
      : next(action)
  }
}
