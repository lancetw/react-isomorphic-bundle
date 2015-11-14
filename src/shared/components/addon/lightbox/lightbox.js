import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

if (process.env.BROWSER) {
  require('css/addon/lightbox')
}
// thanks: https://gist.github.com/epeli/9887246
class Lightbox extends Component {

  static propTypes = {
    children: PropTypes.any
  }

  constructor (props) {
    super(props)
  }

  render () {
    const isAppear = true
    return (
      <ReactCSSTransitionGroup
        transitionName="lightbox"
        transitionAppear={isAppear}
        transitionEnterTimeout={500}
        transitionLeaveTimeout={500}>
        <div className="lightbox">
          <div className="lightbox-wrap">
            <a onClick={Lightbox.remove}>
                {this.props.children}
            </a>
          </div>
        </div>
      </ReactCSSTransitionGroup>
    )
  }
}

Lightbox.component = null

Lightbox.show = function (newComponent) {
  if (Lightbox.component) {
    Lightbox.remove()
  }
  Lightbox.component = newComponent

  ReactDOM.render(
    <Lightbox>{newComponent}</Lightbox>,
    document.getElementById('lightbox-container')
  )
}
Lightbox.remove = function () {
  if (!Lightbox.component) return
  React.unmountComponentAtNode(document.getElementById('lightbox-container'))
  Lightbox.component = null
}

export default Lightbox
