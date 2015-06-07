import React from 'react';
import {Link} from 'react-router';

class Header extends React.Component{
  displayName: 'Header'

  constructor(props, context) {
    super(props);
  }

  render() {
    return (
      <header className="ui orange inverted menu grid fixed top">
        <div className="computer tablet only row">
          <div className="left menu">
            <Link to='/' className="item">
              Home
            </Link>
            <Link to='login' className="item">Login</Link>
          </div>

          <div className="right menu">
            <div className="item">
              <div className="ui transparent icon input inverted">
                <input type="text" placeholder="Search ..." />
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

Header.contextTypes = {
  router: React.PropTypes.func.isRequired
};

export default Header;
