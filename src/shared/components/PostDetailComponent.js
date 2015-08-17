import React, { PropTypes } from 'react'
import { BaseComponent } from 'shared/components'
import GMap from 'shared/components/addon/maps/gmap'
import { isEmpty } from 'lodash'
import { toShortDate } from 'shared/utils/date-utils'
import { getFileExt } from 'shared/utils/file-utils'
import classNames from 'classnames'
import MediaQuery from 'react-responsive'
import Ad from 'shared/components/addon/ad'
import { postPropArray } from 'shared/utils/forms'
import { at } from 'lodash'
import counterpart from 'counterpart'
import { Link } from 'react-router'
import { fixLocaleName, originLocaleName } from 'shared/utils/locale-utils'

export default class Post extends BaseComponent {

  static propTypes = {
    auth: PropTypes.object.isRequired,
    post: PropTypes.object.isRequired,
    map: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    setPin: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
    defaultLocale: PropTypes.string.isRequired
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)

    counterpart.setLocale(props.defaultLocale)

    this.state = {
      locale: fixLocaleName(counterpart.getLocale())
    }

    counterpart.onLocaleChange(::this.handleLocaleChange)
    this.releaseTimeout = undefined
  }

  componentWillUnmount () {
    if (this.op) {
      clearTimeout(this.releaseTimeout)
    }
  }

  getDetailProp (index) {
    return at(postPropArray(originLocaleName(this.state.locale)), index)
  }

  render () {
    const Translate = require('react-translate-component')
    const { detail } = this.props.post
    const { content } = detail
    const files = typeof detail.file !== 'undefined'
      ? JSON.parse(detail.file)
      : []

    const detailClass = detail.id
      ? classNames('content')
      : classNames('content', 'hide')

    const finalContent = content && content.split('\n').map((t) => {
      return t === '' ? <br /> : <p>{t}</p>
    })

    const eventDate = (detail.startDate === detail.endDate)
    ? toShortDate(detail.endDate)
    : toShortDate(detail.startDate) + ' - ' + toShortDate(detail.endDate)

    const detailProp = this.getDetailProp(detail.prop)

    return (
      <main
        className="
          ui two column post detail stackable has-header grid container">
        <div className="column">
          <div className="row">
            <div className="ui fluid detail card">
              <div className={detailClass}>
                <h1 className="header left floated">{detail.title}</h1>
                <div className="meta">
                  <div className="ui orange label large right floated time">
                    {eventDate}
                  </div>
                </div>
                <div className="description">
                  {finalContent}
                  { files && !isEmpty(files)
                    &&
                    <h4 className="ui horizontal divider header">
                      <Translate content="post.detail.attachments" />
                    </h4> }
                  {
                    files && !isEmpty(files)
                    && files.map(function (file, i) {
                      return (
                        <div
                          className="fileName"
                          key={i}
                          data-filetype={getFileExt(file)}>
                          <a
                            target="_blank"
                            href={'/uploads/' + file}>
                            { file }
                          </a>
                        </div>
                      )
                    })
                  }
                </div>
                <div className="taglist right aligned">
                  <span
                    className="ui tag label category">
                    {detailProp}
                  </span>
                </div>
              </div>
              {this.props.auth.user.id === detail.uid &&
              <div className="extra content">
                <div className="ui two buttons">
                  <Link
                    className="ui basic green button"
                    to={`/post/${detail.id}/edit`}>
                    <Translate content="post.detail.edit" />
                  </Link>
                  <a
                    className="ui basic red button"
                    onClick={::this.deletePost}>
                    <Translate content="post.detail.delete.confirm" />
                  </a>
                </div>
              </div>
              }
            </div>
          </div>
        </div>
        <div className="column">
          { (detail.lat && detail.lat) &&
          <GMap
            ref="gmap"
            {...this.props.map}
            defaultLocale={this.props.defaultLocale}
          />
          }
          { (!detail.lat || !detail.lat) &&
          <div className="ui orange center aligned segment">
            <Translate content="post.detail.nomap" />
          </div>
          }
          <div className="row">
            <MediaQuery minDeviceWidth={1224}>
              <div className="ui basic segment center aligned">
                <Ad
                  id="1L"
                  link="http://mx1.hotrank.com.tw/script/oursweb/All_468x40"
                />
              </div>
            </MediaQuery>
            <MediaQuery maxDeviceWidth={1224}>
              <div className="ui basic segment center aligned">
                <Ad
                  id="1S"
                  link="http://mx1.hotrank.com.tw/script/oursweb/200x200"
                />
              </div>
            </MediaQuery>
          </div>
        </div>
      </main>
    )
  }

  handleLocaleChange () {}

  deletePost () {
    const _t = require('counterpart')
    const swal = require('sweetalert')
    const { detail } = this.props.post
    const { remove } = this.props
    const { transitionTo } = this.context.router
    swal({
      title: _t('post.detail.delete.title'),
      text: _t('post.detail.delete.text'),
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: _t('post.detail.delete.confirm'),
      cancelButtonText: _t('post.detail.delete.cancel'),
      closeOnConfirm: false,
      showLoaderOnConfirm: true
    }, () => {
      Promise.all([
        remove(detail.id)
      ]).then(() => {
        swal({
          title: _t('post.detail.delete.ok.title'),
          text: _t('post.detail.delete.ok.text'),
          type: 'success',
          confirmButtonText: _t('post.detail.delete.ok.confirm'),
          closeOnConfirm: true
        }, () => {
          transitionTo('/manage')
        })
      })
    })
  }

}
