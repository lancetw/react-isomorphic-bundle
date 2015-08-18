import React, { PropTypes } from 'react'
import Wall from './WallComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as AuthActions from '../actions/AuthActions'
import * as PostActions from '../actions/PostActions'
import { updateTitle } from '../actions/LocaleActions'
import DocumentTitle from './addon/document-title'
import { PostPropArray } from 'shared/utils/forms'
import { at } from 'lodash'
import counterpart from 'counterpart'
import moment from 'moment'
import 'moment/locale/zh-tw'
import { fixLocaleName, originLocaleName } from 'shared/utils/locale-utils'
import { BaseComponent } from 'shared/components'

@connect(state => ({
  auth: state.auth,
  post: state.post
}))
export default class WallHandler extends BaseComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired
  }

  static contextTypes = {
    store: PropTypes.object.isRequired,
    translator: PropTypes.object
  }

  constructor (props, context) {
    super(props, context)

    this.state = {
      limit: 10,
      nextOffset: 0,
      locale: fixLocaleName(counterpart.getLocale())
    }

    const { dispatch, resolver } = context.store

    this.postActions = bindActionCreators(PostActions, dispatch)
    this.authActions = bindActionCreators(AuthActions, dispatch)
    resolver.resolve(this.authActions.showUser, props.auth.token)
    const { cprop } = props.params

    if (cprop > 0) {
      dispatch(updateTitle(::this.getCardProp(cprop) + 'title.wall_cprop'))
      resolver.resolve(this.postActions.cpropList, cprop, 0, 10, true)
    } else {
      dispatch(updateTitle('title.wall'))
      resolver.resolve(this.postActions.defaultList, 0, 10, true)
    }

    counterpart.onLocaleChange(::this.handleLocaleChange)
  }

  getCardProp (index) {
    const _lang = originLocaleName(this.state.locale)
    return at(PostPropArray(_lang), index)
  }

  render () {
    const { params } = this.props
    const { cprop } = params
    const defaultTitle = this._T('title.site')
    const title = cprop > 0
      ? ::this.getCardProp(cprop) + this._T('title.wall_cprop')
      : this._T('title.wall')

    return (
      <DocumentTitle title={title} defaultTitle={defaultTitle}>
        <Wall
          {...this.props}
          defaultLocale={this.getLocale()}
          loadFunc={::this.loadFunc}
        />
      </DocumentTitle>
    )
  }

  loadFunc () {
    const { dispatch, params } = this.props
    const { cprop } = params
    const nextOffset = this.state.nextOffset + this.state.limit
    if (cprop > 0) {
      dispatch(PostActions.cpropList(cprop, nextOffset - 1, this.state.limit))
    } else {
      dispatch(PostActions.defaultList(nextOffset - 1, this.state.limit))
    }

    this.setState({ nextOffset: nextOffset })
  }

  handleLocaleChange (newLocale) {
    if (process.env.BROWSER) {
      const locale = fixLocaleName(newLocale)
      moment.locale(locale)
      this.setState({ locale })
    }
  }

}

