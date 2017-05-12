import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router'
import { isEmpty } from 'lodash'
import {
  Menu
} from 'client/admin/components/widget'
import moment from 'moment'

export default class Statistics extends Component {

  static propTypes = {
    collect: PropTypes.object.isRequired,
    fetchData: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
  }

  componentDidMount () {
    Plotly.newPlot('plot', [{
      x: this.props.collect.data.map((d,_)=>moment(d.day).format()),
      y: this.props.collect.data.map((d,_)=>d.count),
      type: 'bar',
      marker: {
        color: 'orange'
      }
    }], {
      height: 250,
      margin: {
        t: 0, r: 30, l: 30
      },
      xaxis: {
        gridcolor: 'transparent'
      }
    }, {
      displayModeBar: false
    });
  }

  componentDidUpdate() {
    Plotly.newPlot('plot', [{
      x: this.props.collect.data.map((d,_)=>moment(d.day).format()),
      y: this.props.collect.data.map((d,_)=>d.count),
      type: 'bar',
      marker: {
        color: 'orange'
      }
    }], {
      height: 250,
      margin: {
        t: 0, r: 30, l: 30
      },
      xaxis: {
        gridcolor: 'transparent'
      }
    }, {
      displayModeBar: false
    });
  }

  handleSubmit = (event) => {
    event.preventDefault()
    const year = +ReactDOM.findDOMNode(this.refs.year).value
    const month = +ReactDOM.findDOMNode(this.refs.month).value
    this.props.fetchData({year, month})
  }

  render () {
    const { items, countPosts, countUsers, year, month } = this.props.collect

    return (
      <main className="ui column page grid container">
        <div className="column">
          <div className="row">
            <div className="image logo admin"></div>
          </div>
          <Menu {...this.props} />
          <div className="ui grid">
            <div className="column">
              <div className="ui segment">
                <div className="ui mini form">
                  <div className="inline fields">
                    <div className="field">
                      <input ref="year" type="number" max="2038" min="1970" placeholder="年" defaultValue={year} />
                    </div>
                    <div className="field">
                      <input ref="month" type="number" max="12" min="1" placeholder="月" defaultValue={month} />
                    </div>
                    <button className="ui icon button" onClick={this.handleSubmit}>
                      <i className="search icon"></i>
                    </button>
                  </div>
                </div>
                <div className="ui statistics">
                  <div className="ui horizontal statistic">
                    <div className="value">
                      {countPosts}
                    </div>
                    <div className="label">
                      則活動訊息佈告
                    </div>
                  </div>
                  <div className="ui horizontal statistic">
                    <div className="value">
                      {countUsers}
                    </div>
                    <div className="label">
                      人張貼佈告
                    </div>
                  </div>
                </div>
                <div id="plot"></div>
                <table className="ui very basic  table">
                  <thead>
                    <tr><th>帳號（Email）</th>
                    <th>發文數量</th>
                  </tr></thead>
                  <tbody>
                  {!isEmpty(items) && items.map((item, i) => {
                    return (
                    <tr>
                      <td>
                        <h4 className="ui image header">
                          <div className="content">
                            {item['user.email']}
                            <div className="sub header">{item['user.name']}
                          </div>
                        </div>
                      </h4></td>
                      <td>
                        {item.count}
                      </td>
                    </tr>
                    )
                  })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }
}
