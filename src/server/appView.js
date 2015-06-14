'use strict';

import React from 'react';
import Router from 'react-router/build/npm/lib';
import FluxComponent from 'flummox/component';
import Flux from '../shared/Flux';
import routes from '../shared/routes';
import performRouteHandlerStaticMethod from '../shared/utils/performRouteHandlerStaticMethod';
import fs from 'fs';
import path from 'path';
import nunjucks from 'nunjucks';
import debug from 'debug';

nunjucks.configure('views', {
  autoescape: true,
});

export default function (app) {

  app.use(function *() {
    const isCashed = this.cashed ? yield *this.cashed() : false;
    if (!isCashed) {

      const flux = new Flux();

      const router = Router.create({
        routes: routes,
        location: this.url,
        transitionContext: {
          flux: flux,
          token: this.session.token || null
        },
        onError: error => {
          throw error;
        },
        onAbort: abortReason => {
          const error = new Error();

          if (abortReason.constructor.name === 'Redirect') {
            const { to, params, query } = abortReason;
            const url = router.makePath(to, params, query);
            error.redirect = url;
          }

          throw error;
        }
      });


      let appString, assets, title;
      try {
        const { Handler, state } = yield new Promise((resolve, reject) => {
          router.run((_Handler, _state) =>
            resolve({Handler: _Handler, state: _state})
          );
        });

        const routeHandlerInfo = {state, flux};

        /* Important: must sync auth token on server with session */
        yield flux.getActions('auth').sync(this.session.token);

        try {
          yield performRouteHandlerStaticMethod(state.routes, 'routerWillRun', routeHandlerInfo);
        }
        catch (error) {
          debug('dev')(error);
        }

        const env = process.env.NODE_ENV;
        if (env === 'development') {
          assets = fs.readFileSync(path.resolve(__dirname, '../../storage/webpack-stats.json'));
          assets = JSON.parse(assets);
        }
        else {
          assets = require('storage/webpack-stats.json');
        }

        appString = React.renderToString(
          <FluxComponent flux={flux}>
            <Handler {...state} />
          </FluxComponent>
        );

        title = flux.getStore('page').state.title;

      }
      catch (error) {
        if (error.redirect) {
          return this.redirect(error.redirect);
        }

        throw error;
      }

      this.body = nunjucks.render('index.html', {
        appString,
        assets,
        env: process.env,
        title
      });

    }
  });
}
