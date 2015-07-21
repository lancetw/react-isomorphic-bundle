'use strict'

import { Router } from 'react-router'
import { sync, checkToken, logout } from 'shared/actions/AuthActions'

export default function (nextState, transition) {

  this.store.dispatch(checkToken())
  const isAuthenticated = this.store.getState().auth.isAuthenticated
  const verified = this.store.getState().auth.verified

  if (!isAuthenticated)
    transition.to(
      '/login',
      null,
      { nextPathname: nextState.location.pathname }
    )

  if ((typeof document !== 'undefined') && !verified) {
    this.store.dispatch(logout())
    transition.to(
      '/login',
      null,
      { nextPathname: nextState.location.pathname }
    )
  }
}
