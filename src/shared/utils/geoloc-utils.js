import counterpart from 'counterpart'

function showError (error) {
  const sweetAlert = require('sweetalert')

  switch (error.code) {
  case error.PERMISSION_DENIED:
    sweetAlert(counterpart('geoloc.denied'))
    break
  case error.POSITION_UNAVAILABLE:
    sweetAlert(counterpart('geoloc.unavailable'))
    break
  case error.TIMEOUT:
    sweetAlert(counterpart('geoloc.timeout'))
    break
  case error.UNKNOWN_ERROR:
    sweetAlert(counterpart('geoloc.unknown'))
    break
  default:
    break
  }
}

export function runGeoLoc (highAccuracy=true, timeout=10000, maximumAge=0) {
  const sweetAlert = require('sweetalert')

  return new Promise((resolve, reject) => {
    if (typeof navigator === 'undefined') resolve('navigator is undefined')

    if (navigator.geolocation) {
      const optn = {
        enableHighAccuracy: highAccuracy,
        timeout: timeout,
        maximumAge: maximumAge
      }
      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => {
          showError(error)
          reject(error)
        }, optn)
    } else {
      sweetAlert(counterpart('geoloc.nosupported'))
      resolve('geolocation is not supported')
    }
  })
}

