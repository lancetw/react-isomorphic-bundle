'use strict'

import React from 'react'
import createSideEffect from 'react-side-effect'

let defaultTitle = 'Isomorphic flummox demo'

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
