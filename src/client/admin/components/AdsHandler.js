import React, { PropTypes } from 'react'
import Ads from './AdsComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as AdActions from 'client/admin/actions/AdActions'
import { isEmpty } from 'lodash'

let swal
if (process.env.BROWSER) {
  swal = require('sweetalert')
}

class AdsHandler extends React.Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    collect: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)

    this.state = { page: { selected: 0 } }
  }

  componentWillMount () {
    const { dispatch } = this.props
    dispatch(AdActions.fetchList({ offset: 0, limit: 10 }))
  }

  asyncDeportAction (arr) {
    return dispatch => {
      const list = []
      if (!isEmpty(arr)) {
        arr.forEach(id => list.push(dispatch(AdActions.cancel(id))))
      }
      return Promise.all(list)
    }
  }

  deleteAds (checked) {
    const { dispatch } = this.props

    if (!isEmpty(checked)) {
      return new Promise((resolve, reject) => {
        swal({
          title: '您確定嗎？',
          text: '這會永久刪除廣告網址',
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#DD6B55',
          confirmButtonText: '確定刪除',
          cancelButtonText: '取消',
          closeOnConfirm: false,
          showLoaderOnConfirm: true
        }, function() {
          return dispatch(this.asyncDeportAction(checked)).then(() => {
            swal('刪除', '刪除作業完成', 'success')
            resolve(dispatch(AdActions.fetchList({ offset: 0, limit: 10 })))
          }).catch((err) => {
            swal('Oops...', err, 'error')
            reject(err)
          })
        }.bind(this))
      })
    } else {
      return Promise.resolve()
    }
  }

  render () {
    const { dispatch } = this.props
    return (
      <Ads
        {...bindActionCreators(AdActions, dispatch)}
        {...this.props}
        deleteAction={::this.deleteAds}
        menuIndex={2}
      />
    )
  }
}

export default connect(state => ({
  collect: state.ad
}))(AdsHandler)
