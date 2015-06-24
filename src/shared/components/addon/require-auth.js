'use strict'

import { Router } from 'react-router'
import { sync, checkToken } from 'shared/actions/AuthActions'

export default function (nextState, transition) {

  Promise.all([ authPromise(this.redux), checkPromise(this.redux) ])
   .then(values => {
      const isAuthenticated = values[0]
      const verified = values[1]
      //console.log('isAuthenticated', isAuthenticated)
      //console.log('verified', verified)
      if (!(isAuthenticated && verified))
        transition.to(
          '/login',
          null,
          { nextPathname: nextState.location.pathname }
        )
    })
}

function authPromise (redux) {
  return new Promise((resolve) => {
    new Promise((_resolve) => { _resolve(redux.dispatch(sync())) })
      .then(() => { resolve(redux.getState().auth.isAuthenticated) })
  })
}

function checkPromise (redux) {
  return new Promise((resolve) => {
    new Promise((_resolve) => { _resolve(redux.dispatch(checkToken())) })
      .then(() => { resolve(redux.getState().auth.verified) })
  })
}

