import React from 'react'
import { Route, Redirect } from 'react-router'
import {
  App,
  Home,
  Login,
  Logout,
  Signup,
  Post,
  PostDetail,
  PostEdit,
  Manage,
  Wall,
  Cal,
  ChangePassword,
  SyncToken,
  Direct,
  Search
} from './components'
import NotFound from './pages/NotFound'
import auth from './components/addon/require-auth'

export default function (store) {
  return (
    <Route component={App}>
      <Route path="/" component={Home} />
      <Route path="/home" component={Home} />
      <Route path="/search" component={Search} />
      <Route path="/login" component={Login} />
      <Route path="/logout" component={Logout} />
      <Route path="/signup" component={Signup} />
      <Redirect from="/wall" to="/wall/today" />
      <Route path="/wall">
        <Route path="today" component={Wall} />
        <Route path="cal" component={Cal} />
        <Route path="posts/:id" component={PostDetail} />
      </Route>
      <Route path="/post" component={Post} store={store} onEnter={auth}/>
      <Route
        path="/post/:id/edit"
        component={PostEdit}
        store={store}
        onEnter={auth} />
      <Route path="/manage" component={Manage} store={store} onEnter={auth} />
      <Route path="/password" component={ChangePassword}
        store={store} onEnter={auth} />
      <Route path="/sync/token" component={SyncToken} />
      <Route path="*" component={NotFound} />
      <Redirect from="/" to="/home" />
    </Route>
  )
}
