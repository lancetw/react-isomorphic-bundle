import React from 'react';
import {Route, DefaultRoute, NotFoundRoute} from 'react-router';
import AppHandler from './components/AppHandler';
import HomeHandler from './components/HomeHandler';
import LoginHandler from './components/LoginHandler';
import PostHandler from './components/PostHandler';
import NotFound from './pages/NotFound';

export default (
  <Route name="app" path="/" handler={AppHandler}>
    <DefaultRoute name="home" handler={HomeHandler} />
    <Route name="login" path="/login" handler={LoginHandler} />
    <Route name="post" path="/post" handler={PostHandler} />
    <Route path="/auth/facebook" />
    <Route path="/auth/facebook/callback" />
    <NotFoundRoute handler={NotFound} />
  </Route>
);
