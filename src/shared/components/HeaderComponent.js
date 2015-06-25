import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { T } from 'shared/components/addon/i18n'

export default class Header extends React.Component {

  constructor (props) {
    super(props)
    props.sync()
  }

  static propTypes = {
    sync: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
  }

  render () {
    let AuthLink
    if (!this.props.auth.token)
      AuthLink = <Link to='/login' className="item">Log In</Link>
    else
      AuthLink = <Link to='/logout' className="item">Log Out</Link>

    let ChangePasswordLink
    if (this.props.auth.token)
      ChangePasswordLink = (
        <Link to='/password' className="item">
          Password
        </Link>
      )

    return (
      <header className="ui orange inverted menu grid fixed top">
        <div className="computer tablet only row">
          <div className="left menu">
            <Link to='/home' className="item">
              Home
            </Link>
            {AuthLink}
            <Link to='/wall' className="item"><T key='Wall'>Wall</T></Link>
            <Link to='/post' className="item"><T key='Post'>Post</T></Link>
            {ChangePasswordLink}
          </div>

          <div className="right menu">
            <div className="item">
              <div className="ui transparent icon input inverted">
                <input
                  type="text"
                  placeholder="Search ..."
                  aria-label="Search"
                />
                <i className="search icon"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="mobile only row">
          <Link className="item left" to="wall">
            Home
          </Link>
          <Link to='post' className="item">Post</Link>

        </div>
        <div className="right menu">
          {AuthLink}
        </div>
      </header>
    )
  }
}
