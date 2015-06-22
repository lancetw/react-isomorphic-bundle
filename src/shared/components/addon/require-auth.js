'use strict'

import debug from 'debug'
import { Router } from 'react-router'

export default function (nextState, transition) {
  const isAuthenticated = this.redux.getState().auth.isAuthenticated
  debug('dev')('isAuthenticated', isAuthenticated)
  if (!isAuthenticated)
    transition.to(
      '/login',
      null,
      { nextPathname: nextState.location.pathname }
    )
}
