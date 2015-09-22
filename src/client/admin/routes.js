import React from 'react'
import { Route, Redirect, IndexRoute } from 'react-router'
import {
  Admin,
  Dash,
  Login
} from 'client/admin/components'
import NotFound from 'client/admin/pages/NotFound'
import auth from 'client/admin/components/addon/require-auth'

export default function (store) {
  return (
    <Route path="/ring" component={Admin}>
      <IndexRoute store={store} component={Login} />
      <Route path="dash" store={store} component={Dash} onEnter={auth} />
      <Route path="*" store={store} component={NotFound} />
    </Route>
  )
}
