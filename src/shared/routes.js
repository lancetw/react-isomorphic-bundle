import React from 'react';
import {Route, DefaultRoute, NotFoundRoute} from 'react-router';
import AppHandler from './components/AppHandler';
import HomeHandler from './components/HomeHandler';
import LoginHandler from './components/LoginHandler';
import NotFound from './pages/NotFound';

export default (
  <Route name="app" path="/" handler={AppHandler}>
    <Route name="login" path="/login" handler={LoginHandler} />
    <DefaultRoute handler={HomeHandler} />
    <NotFoundRoute handler={NotFound} />
  </Route>
);
