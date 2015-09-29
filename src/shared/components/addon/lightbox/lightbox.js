import React, { PropTypes } from 'react/addons'
const { CSSTransitionGroup } = React.addons

if (process.env.BROWSER) {
  require('css/addon/lightbox')
}
// thanks: https://gist.github.com/epeli/9887246
class Lightbox extends React.Component {

  static propTypes = {
    children: PropTypes.any
  }

  constructor (props) {
    super(props)
  }

  render () {
    return (
      <CSSTransitionGroup
        transitionName="lightbox"
        transitionAppear="true">
        <div className="lightbox-bg"></div>
        <div className="lightbox">
          <div className="lightbox-wrap">
            <a onClick={Lightbox.remove}>
                {this.props.children}
            </a>
          </div>
        </div>
      </CSSTransitionGroup>
    )
  }
}

Lightbox.component = null

Lightbox.show = function (newComponent) {
  if (Lightbox.component) {
    Lightbox.remove()
  }
  Lightbox.component = newComponent

  React.render(
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
