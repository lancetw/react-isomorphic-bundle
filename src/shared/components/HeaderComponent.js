import React from 'react';
import {Link} from 'react-router/build/npm/lib';

class Header extends React.Component{
  displayName: 'Header Component'

  render() {

    let AuthLink;
    if (!this.props.token) {
      AuthLink = <Link to='login' className="item">Log In</Link>;
    }
    else {
      AuthLink = <Link to='logout' className="item">Log Out</Link>;
    }

    return (
      <header className="ui orange inverted menu grid fixed top">
        <div className="computer tablet only row">
          <div className="left menu">
            <Link to='/' className="item">
              Home
            </Link>
            {AuthLink}
            <Link to='post' className="item">Post</Link>
          </div>

          <div className="right menu">
            <div className="item">
              <div className="ui transparent icon input inverted">
                <input type="text" placeholder="Search ..." aria-label="Search" />
                <i className="search icon"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="mobile only row">
          <Link className="item left" to="login">
            Home
          </Link>
        </div>
      </header>
    );
  }

}

export default Header;
