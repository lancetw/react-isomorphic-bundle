'use strict'

import debug from 'debug'
import { Router } from 'react-router'
import { load } from 'shared/actions/AuthActions'

export default function (nextState, transition) {
  this.redux.dispatch(load())
  const isAuthenticated = this.redux.getState().auth.isAuthenticated
  debug('dev')('isAuthenticated', isAuthenticated)
  if (!isAuthenticated)
    transition.to(
      '/login',
      null,
      { nextPathname: nextState.location.pathname }
    )
}
