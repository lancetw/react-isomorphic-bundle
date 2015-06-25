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
import { IntlMixin } from 'react-intl'

require('react-a11y')(React)

const initialState = window.STATE_FROM_SERVER   // no data
const redux = createRedux(stores, initialState)

const history = new BrowserHistory()

React.render((
  <Provider redux={redux} i18n={IntlMixin.getIntlMessage}>
    {() =>
      <Router
        children={routes(redux)}
        history={history}
      />
    }
  </Provider>
  ), document.getElementById('app')
)
