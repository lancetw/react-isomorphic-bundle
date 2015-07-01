import React from 'react'
import { Route, Redirect } from 'react-router'
import { App, Home, Login, Logout, Signup, Post,
  Wall, Cal, ChangePassword, SyncToken } from './components'
import NotFound from './pages/NotFound'
import auth from './components/addon/require-auth'

export default function (store) {
  return (
    <Route component={App}>
      <Route path="/" component={Home} />
      <Route path="home" component={Home} />
      <Route path="login" component={Login} />
      <Route path="logout" component={Logout} />
      <Route path="signup" component={Signup} />
      <Route path="wall/today" component={Wall} />
      <Route path="wall/cal" component={Cal} />
      <Route path="post" component={Post}
        store={store} onEnter={auth} />
      <Route path="password" component={ChangePassword}
        store={store} onEnter={auth} />
      <Route path="sync/token" component={SyncToken} />
      <Route path="*" component={NotFound} />
      <Redirect from="/" to="/home" />
    </Route>
  )
}
