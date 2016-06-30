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
  WallCprop,
  Cal,
  Cprop,
  ChangePassword,
  SyncToken,
  Search,
  Nearby,
  Og,
  TWBLogin
} from './components'
import NotFound from './pages/NotFound'
import auth from './components/addon/require-auth'

function preventDefault(e) { e.preventDefault() }

function disableTouchmove () {
  if (typeof document !== 'undefined') {
    document.addEventListener('touchmove', preventDefault, false)
  }
}

function enableTouchmove () {
  if (typeof document !== 'undefined') {
    document.removeEventListener('touchmove', preventDefault, false)
  }
}

export default function (store) {
  return (
    <Route component={App}>
      <Route path="/" component={Home} />
      <Route path="/home" component={Home} />
      <Route path="/search" component={Search} />
      <Route path="/nearby" component={Nearby} onEnter={disableTouchmove} onLeave={enableTouchmove} />
      <Route path="/login" component={Login} />
      <Route path="/logout" component={Logout} />
      <Route path="/signup" component={Signup} />
      <Route path="/w/today" component={Wall} />
      <Route path="/w/cal" component={Cal} />
      <Route path="/w/cprop" component={Cprop} />
      <Route path="/w/cprop/:cprop" component={WallCprop} />
      <Route path="/w/:id" component={PostDetail} />
      <Redirect from="/w" to="/w/today" />
      <Route path="/post" component={Post} store={store} onEnter={auth}/>
      <Route
        path="/post/:id/edit"
        component={PostEdit}
        store={store}
        onEnter={auth} />
      <Route path="/manage" component={Manage} store={store} onEnter={auth} />
      <Route path="/password" component={ChangePassword}
        store={store} onEnter={auth} />
      <Route path="/c">
        <Route path=":cid" component={Og} />
      </Route>
      <Route path="/twb/login" component={TWBLogin} />
      <Route path="/sync/token" component={SyncToken} />
      <Route path="*" component={NotFound} />
      <Redirect from="/" to="/home" />
    </Route>
  )
}
