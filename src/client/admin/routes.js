import React from 'react'
import { Route, Redirect, IndexRoute } from 'react-router'
import {
  Admin,
  Dash,
  Spam,
  Login,
  Members,
  MembersDetail,
  Blocked,
  Ads,
  Permissions,
  Disabled
} from 'client/admin/components'
import NotFound from 'client/admin/pages/NotFound'
import auth from 'client/admin/components/addon/require-auth'

export default function (store) {
  return (
    <Route path="/ring" component={Admin}>
      <IndexRoute store={store} component={Login} />
      <Route path="dash" store={store} component={Dash} onEnter={auth} />
      <Route path="spam" store={store} component={Spam} onEnter={auth} />
      <Route path="members" store={store} component={Members} onEnter={auth} />
      <Route path="members/:id" store={store} component={MembersDetail} onEnter={auth} />
      <Route path="blocked" store={store} component={Blocked} onEnter={auth} />
      <Route path="ads" store={store} component={Ads} onEnter={auth} />
      <Route path="permissions" store={store} component={Permissions} onEnter={auth} />
      <Route path="disabled" store={store} component={Disabled} onEnter={auth} />
      <Route path="*" store={store} component={NotFound} />
    </Route>
  )
}
