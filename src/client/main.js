'use strict';

import React from 'react';
import Router from 'react-router';
import FluxComponent from 'flummox/component';
import Flux from '../shared/Flux';
import routes from '../shared/routes';
import performRouteHandlerStaticMethod from '../shared/utils/performRouteHandlerStaticMethod';
import url from 'url';

if (process.env.NODE_ENV === 'development') {
  require('react-a11y')(React);
  require('debug').enable('dev,koa');
}

const flux = new Flux();

const router = Router.create({
  routes: routes,
  location: Router.HistoryLocation
});

router.run(async (Handler, state) => {
  const routeHandlerInfo = {state, flux};

  await performRouteHandlerStaticMethod(state.routes, 'routerWillRun', routeHandlerInfo);

  document.title = flux.getStore('page').state.title;

  React.render(
    <FluxComponent flux={flux}>
      <Handler {...state} />
    </FluxComponent>,
    document.getElementById('app')
  );
});

document.onclick = event => {
  const { toElement: target } = event;

  if (!target) return;

  if (target.tagName !== 'A') return;

  const href = target.getAttribute('href');

  if (!href) return;

  const resolvedHref = url.resolve(window.location.href, href);
  const { host, path } = url.parse(resolvedHref);

  if (host === window.location.host) {
    event.preventDefault();
    router.transitionTo(path);
  }
};
