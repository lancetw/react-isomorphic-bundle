'use strict'

import React from 'react'
import { Router } from 'react-router'
import { createRedux } from 'redux'
import * as stores from 'shared/stores'
import { Provider } from 'redux/react'
import routes from 'shared/routes'
import BrowserHistory from 'react-router/lib/BrowserHistory'
import runStaticMethod from 'shared/utils/runStaticMethod'
import url from 'url'
import AppContainer from 'shared/components/AppContainer'
import counterpart from 'counterpart'

(async () => {
  require('react-a11y')(React)

  const initialState = window.STATE_FROM_SERVER   // no data
  const redux = createRedux(stores, initialState)

  const history = new BrowserHistory()

  counterpart.registerTranslations('en',
    require('shared/i18n/en'))
  counterpart.registerTranslations('zh-hant-tw',
    require('shared/i18n/zh-hant-tw'))
  counterpart.setLocale('zh-hant-tw')

  React.render((
    <Provider redux={redux}>
      {() =>
        <Router
          children={routes(redux)}
          history={history}
        />
      }
    </Provider>
  ), document.getElementById('app'))

})()
