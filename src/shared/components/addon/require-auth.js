'use strict'

import { Router } from 'react-router'
import { sync, checkToken, showUser, logout } from 'shared/actions/AuthActions'

export default function (nextState, transition) {
  const { dispatch, getState } = this.store
  if (process.env.BROWSER) dispatch(checkToken())
  const isAuthenticated = getState().auth.isAuthenticated
  const verified = getState().auth.verified

  dispatch(showUser(getState().auth.token))

  if (!isAuthenticated)
    transition.to(
      '/login',
      null,
      { nextPathname: nextState.location.pathname }
    )

  if (process.env.BROWSER && !verified) {
    this.store.dispatch(logout())
    transition.to(
      '/login',
      null,
      { nextPathname: nextState.location.pathname }
    )
  }
}
