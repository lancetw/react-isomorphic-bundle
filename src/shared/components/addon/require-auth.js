'use strict'

import { Router } from 'react-router'
import { sync, checkToken } from 'shared/actions/AuthActions'

export default function (nextState, transition) {
  this.store.dispatch(sync())
  this.store.dispatch(checkToken())
  const isAuthenticated = this.store.getState().auth.isAuthenticated
  const verified = this.store.getState().auth.verified

  // console.log('isAuthenticated', isAuthenticated)
  // console.log('verified', verified)

  if (!isAuthenticated)
    return transition.to(
      '/login',
      null,
      { nextPathname: nextState.location.pathname }
    )

  if ((typeof document !== 'undefined') && !verified)
    return transition.to(
      '/logout',
      null,
      {}
    )
}
