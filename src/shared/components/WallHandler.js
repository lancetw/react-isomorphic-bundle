import React, { PropTypes } from 'react'
import Wall from './WallComponent'
import { connect } from 'redux/react'
import { showList } from '../actions/PostActions'
import DocumentTitle from './addon/document-title'

@connect(state => ({
  post: state.post
}))
export default class WallHandler extends React.Component {

  constructor (props) {
    super(props)
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }

  static contextTypes = {
    redux: PropTypes.object.isRequired
  }

  static async routerWillRun ({ dispatch }) {
    return await dispatch(showList())
  }

  componentWillMount () {
    const dispatch = this.context.redux.dispatch
    setTimeout(() => dispatch(showList()), 0)
  }

  render () {
    return (
      <DocumentTitle title='All events for you'>
        <Wall
          {...this.props}
        />
      </DocumentTitle>
    )
  }
}
