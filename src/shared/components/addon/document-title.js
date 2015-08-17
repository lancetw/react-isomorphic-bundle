'use strict'

import React from 'react'
import createSideEffect from 'react-side-effect'
import counterpart from 'counterpart'

counterpart.registerTranslations('en',
  require('shared/i18n/en'))
counterpart.registerTranslations('zh-hant-tw',
  require('shared/i18n/zh-hant-tw'))

function extractTitle (propsList) {
  const innermostProps = propsList[propsList.length - 1]
  if (innermostProps)
    return innermostProps.title
}

function extractDefaultTitle (propsList) {
  const innermostProps = propsList[propsList.length - 1]
  if (innermostProps)
    return innermostProps.defaultTitle
}

let _serverTitle = null
let tmp = null

export default createSideEffect(
  function handleChange (propsList) {

    const title = extractTitle(propsList)
    const defaultTitle = extractDefaultTitle(propsList)

    if (!title) return

    if (process.env.BROWSER)
      if (defaultTitle)
        document.title = title ? `${title} | ${defaultTitle}` : defaultTitle
      else
        document.title = title ? `${title}` : 'Untitled Document'
    else
      if (defaultTitle)
        _serverTitle = title ? `${title} | ${defaultTitle}` : defaultTitle
      else
        _serverTitle = title ? `${title}` : 'Untitled Document'

    tmp = title ? `${title} | ${defaultTitle}` : defaultTitle

  }, {

  displayName: 'DocumentTitle',

  propTypes: {
    title: React.PropTypes.string.isRequired,
    locale: React.PropTypes.string
  },

  contextTypes: {
    defaultTitle: React.PropTypes.string
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
