import counterpart from 'counterpart'

function showError (error) {
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

export function runGeoLoc (func, highAccuracy=true, timeout=10000, maximumAge=0) {
  if (typeof navigator === 'undefined') return false

  if (navigator.geolocation) {
    const optn = {
      enableHighAccuracy: highAccuracy,
      timeout: timeout,
      maximumAge: maximumAge
    }
    navigator.geolocation
      .getCurrentPosition(func, showError, optn)
  } else {
    sweetAlert(counterpart('geoloc.nosupported'))
  }
}

