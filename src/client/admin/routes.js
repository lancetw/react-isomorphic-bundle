import React from 'react'
import { Route, Redirect } from 'react-router'
import {
  Admin,
  Dash
} from 'client/admin/components'

export default function (store) {
  return (
    <Route component={Admin}>
      <Route path="/supervisor" component={Dash} />
    </Route>
  )
}
