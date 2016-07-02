import counterpart from 'counterpart'

export function checkUnauthorized (errors, replaceState) {
  if (!process.env.BROWSER) return false

  const swal = require('sweetalert')
  if (errors === 'Unauthorized') {
    return swal({
      title: counterpart('http.error.401.title'),
      text: counterpart('http.error.401.text'),
      type: 'error'
    }, function() {
      replaceState({}, '/logout')
    })
  }
}
