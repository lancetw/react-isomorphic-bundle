import React from 'react'
import { Route, Redirect } from 'react-router'
import { App, Home, Login, Logout, Signup, Post,
  Wall, ChangePassword, SyncToken } from './components'
import NotFound from './pages/NotFound'
import auth from './components/addon/require-auth'

export default function (redux) {
  return (
    <Route component={App}>
      <Route path="/" component={Home} />
      <Route path="home" component={Home} />
      <Route path="login" component={Login} />
      <Route path="logout" component={Logout} />
      <Route path="signup" component={Signup} />
      <Route path="wall" component={Wall} />
      <Route path="post" component={Post}
        redux={redux} onEnter={auth} />
      <Route path="password" component={ChangePassword}
        redux={redux} onEnter={auth} />
      <Route path="sync/token" component={SyncToken} />
      <Route path="*" component={NotFound} />
      <Redirect from="/" to="/home" />
    </Route>
  )
}
