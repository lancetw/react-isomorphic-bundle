import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

let Spinner
if (process.env.BROWSER) {
  Spinner = require('react-spinkit')
  require('css/addon/loading')
}
// thanks: https://gist.github.com/epeli/9887246
class Loading extends Component {

  static propTypes = {
    children: PropTypes.string
  }

  constructor (props) {
    super(props)
  }

  render () {
    const isAppear = true
    return (
      <ReactCSSTransitionGroup
        transitionName="xloading"
        transitionAppear={isAppear}
        transitionAppearTimeout={500}
        transitionEnterTimeout={500}
        transitionLeaveTimeout={500}>
        <div className="xloading">
          <div className="xloading-wrap">
            <Spinner spinnerName="wordpress" />
            {this.props.children}
          </div>
        </div>
      </ReactCSSTransitionGroup>
    )
  }
}

Loading.component = null

Loading.show = function (newComponent) {
  if (Loading.component) {
    Loading.hide()
  }
  Loading.component = newComponent

  ReactDOM.render(
    <Loading>{newComponent}</Loading>,
    document.getElementById('loading-container')
  )
}
Loading.hide = function () {
  if (!Loading.component) return
  ReactDOM.unmountComponentAtNode(document.getElementById('loading-container'))
  Loading.component = null
}

export default Loading
