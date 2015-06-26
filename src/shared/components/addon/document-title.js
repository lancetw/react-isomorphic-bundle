'use strict'

import React from 'react'
import createSideEffect from 'react-side-effect'
import _t from 'counterpart'

_t.setLocale('zh-hant-tw')
_t.registerTranslations('en',
  require('shared/i18n/en'))
_t.registerTranslations('zh-hant-tw',
  require('shared/i18n/zh-hant-tw'))

let defaultTitle = _t('title.site')

function extractTitle (propsList) {
  const innermostProps = propsList[propsList.length - 1]
  if (innermostProps)
    return innermostProps.title
}

let _serverTitle = null

export default createSideEffect(
  function handleChange (propsList) {

    const title = extractTitle(propsList)

    if (!title) return

    if (typeof document !== 'undefined')
      document.title = title ? `${title} | ${defaultTitle}` : defaultTitle
    else
      _serverTitle = title ? `${title} | ${defaultTitle}` : defaultTitle

  }, {

  displayName: 'DocumentTitle',

  propTypes: {
    title: React.PropTypes.string.isRequired
  },

  statics: {
    peek: function () {
      return _serverTitle
    },

    rewind: function () {
      const title = _serverTitle
      this.dispose()
      return title
    }
  }

})
