import React, { PropTypes } from 'react'
import { Link } from 'react-router'

export default class Dash extends React.Component {

  static contextTypes = {
    history: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)
  }

  render () {
    return (
      <main className="ui column page grid container">
        <div className="column">
          <div className="row">
            <div className="image logo"></div>
          </div>
          <div className="ui labeled icon menu">
            <a className="item">
              <i className="cube icon"></i>
              佈告管理
            </a>
            <a className="item">
              <i className="user icon"></i>
              使用者維護
            </a>
            <a className="item">
              <i className="setting icon"></i>
              廣告設定
            </a>
            <a className="item">
              <i className="sign out icon"></i>
              登出
            </a>
          </div>
          <div className="ui grid">
            <div className="four wide column">
              <div className="ui fluid vertical menu">
                <a className="active item">
                  <div className="ui teal label">23127</div>
                  佈告列表
                </a>
                <a className="item">
                  <div className="ui label">51</div>
                  垃圾文章
                </a>
                <div className="item">
                  <div className="ui icon input">
                    <input type="text" placeholder="搜尋佈告..." />
                    <i className="search icon"></i>
                  </div>
                </div>
              </div>
            </div>
            <div className="twelve wide stretched column">
              <table className="ui compact celled definition table">
                <thead className="full-width">
                  <tr>
                    <th></th>
                    <th>標題</th>
                    <th>發文日期</th>
                    <th>發文者</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="collapsing">
                      <div className="ui fitted toggle checkbox">
                        <input type="checkbox" /> <label></label>
                      </div>
                    </td>
                    <td>John Lilki</td>
                    <td>September 14, 2013</td>
                    <td>jhlilk22@yahoo.com</td>
                  </tr>
                  <tr>
                    <td className="collapsing">
                      <div className="ui fitted toggle checkbox">
                        <input type="checkbox" /> <label></label>
                      </div>
                    </td>
                    <td>Jamie Harington</td>
                    <td>January 11, 2014</td>
                    <td>jamieharingonton@yahoo.com</td>
                  </tr>
                  <tr>
                    <td className="collapsing">
                      <div className="ui fitted toggle checkbox">
                        <input type="checkbox" /> <label></label>
                      </div>
                    </td>
                    <td>Jill Lewis</td>
                    <td>May 11, 2014</td>
                    <td>jilsewris22@yahoo.com</td>
                  </tr>
                </tbody>
                <tfoot className="full-width">
                  <tr>
                    <th></th>
                    <th colSpan="4">
                      <div className="ui small red button">
                        確認為垃圾文章
                      </div>
                    </th>
                  </tr>
                </tfoot>
              </table>
              <div className="ui pagination menu">
                <a className="active item">
                  1
                </a>
                <div className="disabled item">
                  ...
                </div>
                <a className="item">
                  10
                </a>
                <a className="item">
                  11
                </a>
                <a className="item">
                  12
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }
}
