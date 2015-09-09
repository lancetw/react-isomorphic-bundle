import React, { Children, Component, PropTypes } from 'react'
import withSideEffect from 'react-side-effect'

class DocumentTitle extends Component {
  render () {
    if (this.props.children) {
      return Children.only(this.props.children)
    } else {
      return null
    }
  }
}

DocumentTitle.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.any
}

function reducePropsToState (propsList) {
  const innermostProps = propsList[propsList.length - 1]
  if (innermostProps) {
    const { defaultTitle, title } = innermostProps
    if (typeof title !== 'undefined') {
      return defaultTitle
        ? `${title} | ${defaultTitle}`
        : `${title} | Untitled Document`
    }
  }
}

function handleStateChangeOnClient (title) {
  document.title = title || ''
}

export default withSideEffect(
  reducePropsToState,
  handleStateChangeOnClient
)(DocumentTitle)
