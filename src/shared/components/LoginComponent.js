import React from 'react';
import {Link} from 'react-router/build/npm/lib';
import BaseComponent from 'shared/components/BaseComponent';
import {Form, FormT, LoginForm, LoginFormOptions} from 'shared/utils/forms';
import {isEmpty, clone, omit} from 'lodash';

class Login extends BaseComponent{
  displayName: 'Log in Component'

  constructor(props, context) {
    super(props);
    this.state = {value: {email: '', password: ''}, options: LoginFormOptions, submited: false};

    this._bind('handleSubmit', 'clearFormErrors', 'fillFormAllErrors');
  }

  handleSubmit(evt) {
    evt.preventDefault();
    var value = this.refs.form.getValue();
    if (value) {
      let saved = clone(value);
      saved = omit(saved, 'password');
      this.setState({value: saved});
      this.props.flux.getActions('auth').send(value);
      this.setState({submited: true});
      this.clearFormErrors();
    }
  }

  clearFormErrors() {
    let options = clone(this.state.options);
    options.fields = clone(options.fields);

    for (let key in options.fields) {
      options.fields[key] = clone(options.fields[key]);
      if (options.fields[key].hasOwnProperty('hasError')) {
        options.fields[key].hasError = false;
      }
    }
    this.setState({options: options});
  }

  fillFormAllErrors() {
    let options = clone(this.state.options);
    options.fields = clone(options.fields);

    for (let key in options.fields) {
      options.fields[key] = clone(options.fields[key]);
      if (options.fields[key].hasOwnProperty('hasError')) {
        options.fields[key].hasError = true;
      }
    }
    this.setState({options: options});
  }

  validation(token) {
    if (isEmpty(token)) {
      this.fillFormAllErrors();
      this.setState({submited: false});
    }
  }

  checkSubmited(response) {
    if (!isEmpty(response)) {
      this.setState({submited: true});

      setTimeout(function () {
        this.context.router.transitionTo('/');
      }.bind(this), 1000);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.validation(nextProps.token);
    this.checkSubmited(nextProps.token);
  }

  render() {
    return (
      <main className="ui stackable page grid">
        <div className="column">
          <div className="ui two column middle aligned relaxed fitted stackable grid">
            <div className="column">
              <form className="ui form segment" action="/auth/login" method="post" onSubmit={this.handleSubmit}>
                <Form ref="form" type={LoginForm} options={this.state.options} value={this.state.value} />
                <div className="ui hidden divider" />
                <button type="submit" className="fluid ui blue large button" disabled={this.state.submited}>
                  Log In
                </button>
              </form>
            </div>
            <div className="ui vertical divider">
              or
            </div>
            <div className="center aligned column">
              <Link className="large blue ui labeled icon button"
                to="/auth/facebook">
                <i className="facebook icon"></i>
                Sign In with Facebook
              </Link>
              <div className="ui hidden divider"></div>
              <Link className="ui huge green labeled icon button"
                to="/signup">
                <i className="signup icon"></i>
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }
}

Login.propTypes = {
  errors: React.PropTypes.object
};

Login.defaultTypes = {
  errors: {}
};

Login.contextTypes = {
  router: React.PropTypes.func.isRequired
};

export default Login;
