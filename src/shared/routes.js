import React from 'react';
import {Route, DefaultRoute, NotFoundRoute} from 'react-router/build/npm/lib';
import AppHandler from './components/AppHandler';
import HomeHandler from './components/HomeHandler';
import LoginHandler from './components/LoginHandler';
import LogoutHandler from './components/LogoutHandler';
import SignupHandler from './components/SignupHandler';
import PostHandler from './components/PostHandler';
import DirectHandler from './components/DirectHandler';
import SyncTokenHandler from './components/SyncTokenHandler';
import NotFound from './pages/NotFound';

export default (
  <Route name="app" path="/" handler={AppHandler}>
    <DefaultRoute name="home" handler={HomeHandler} />
    <Route name="login" path="/login" handler={LoginHandler} />
    <Route name="logout" path="/logout" handler={LogoutHandler} />
    <Route name="signup" path="/signup" handler={SignupHandler} />
    <Route name="post" path="/post" handler={PostHandler} />
    <Route path="/sync/token" handler={SyncTokenHandler} />
    <Route path="/auth/facebook" handler={DirectHandler} />
    <Route path="/auth/login" handler={DirectHandler} />
    <Route path="/auth/logout" handler={DirectHandler} />
    <NotFoundRoute handler={NotFound} />
  </Route>
);
