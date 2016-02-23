function onError (err) {
  setTimeout(function () {
    throw err
  }, 0)
}

function isPromise (val) {
  return val && typeof val.then === 'function'
}

module.exports = (store) => {
  return function (next) {
    return function (action) {
      if (typeof action.type === 'undefined') action.type = null;
      return isPromise(action)
        ? action.then(next, onError)
        : next(action)
    }
  }
}
