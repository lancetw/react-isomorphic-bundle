'use strict'

import { Router } from 'react-router'
import { sync, checkToken } from 'shared/actions/AuthActions'

export default function (nextState, transition) {
  this.redux.dispatch(sync())
  this.redux.dispatch(checkToken())
  const isAuthenticated = this.redux.getState().auth.isAuthenticated
  const verified = this.redux.getState().auth.verified

  // console.log('isAuthenticated', isAuthenticated)
  // console.log('verified', verified)

  if (!isAuthenticated)
    return transition.to(
      '/login',
      null,
      { nextPathname: nextState.location.pathname }
    )

  if (!verified)
    return transition.to(
      '/logout',
      null,
      {}
    )
}
