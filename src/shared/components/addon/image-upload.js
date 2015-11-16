import React, { Component, PropTypes } from 'react'
import Dropzone from 'react-dropzone'
import { connect } from 'react-redux'
import * as UploadActions from 'shared/actions/UploadActions'
import { isEmpty } from 'lodash'

class ImageUpload extends Component {

  static propTypes = {
    index: PropTypes.number.isRequired,
    upload: PropTypes.object.isRequired,
    src: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  static defaultProps = {
    index: 0,
    src: '/images/image.png'
  }

  constructor (props) {
    super(props)
  }

  handleDrop = (files) => {
    const sizeLimit = 1024 * 1024 * 3
    const { dispatch } = this.props
    const file = files[0]
    if (file.size > sizeLimit) {
      dispatch(UploadActions.setErrorMessage('1', 'too large'))
      return
    }

    if (typeof file.preview !== 'undefined') {
      dispatch(UploadActions.clearErrorMessage())
      dispatch(UploadActions.send(file.name, file, this.props.index))

      const percentage = +this.props.upload.percentages[this.props.index]
    }
  }

  renderPrecentage = (index) => {
    const percentage = this.props.upload.percentages[index]
    if (!percentage) {
      return (
        <div
          className="ui yellow percentage message">
          <div>{percentage} %</div>
        </div>
      )
    } else if (+percentage < 100) {
      return (
        <div
          className="ui blue percentage message">
          <div>{percentage} %</div>
        </div>
      )
    } else if (+percentage === 100) {
      if (!this.props.upload.errorMessages
        || isEmpty(this.props.upload.errorMessages[index])) {
        return (
          <div
            className="ui green percentage message">
            <div>{percentage} %</div>
          </div>
        )
      }
    }
  }

  render () {
    let imgsrc
    if (typeof this.props.upload.images !== 'undefined') {
      imgsrc = this.props.upload.images[this.props.index]
    }

    return (
      <div className="column" onTouchStart={(event) => {
        return this.refs.dropzone.open()
      } }>
        <Dropzone
          ref="dropzone"
          multiple={false}
          style={{}}
          size={120}
          onDrop={this.handleDrop}>
          <img
            className="ui image centered placeholder"
            alt=""
            src={ imgsrc || this.props.src } />
          {this.renderPrecentage(this.props.index)}
        </Dropzone>
      </div>
    )
  }
}

export default connect(state => ({
  upload: state.upload
}))(ImageUpload)
