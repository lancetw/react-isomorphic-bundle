import React from 'react';
import BaseComponent from 'shared/components/BaseComponent';
import {Form, Tcomb, SignupForm, SignupFormOptions} from 'shared/utils/forms';
import {isEmpty, clone, omit} from 'lodash';

class Signup extends BaseComponent{
  displayName: 'Signup Component'

  constructor(props, context) {
    super(props);
    this.state = {value: {email: '', password: '', tos: false}, options: SignupFormOptions, submited: false};

    this._bind('handleSubmit', 'validation', 'handleChange');
  }

  handleChange(value, path) {
    if (path[0] === 'password' || path[0] === 'passwordCheck') {
      const pass = this.refs.form.getComponent('password');
      const check = this.refs.form.getComponent('passwordCheck');
      if (pass.state.value !== check.state.value) {
        check.setState({hasError: true});
      }
      else {
        check.setState({hasError: false});
      }

      if (pass.state.value.length < 6) {
        pass.setState({hasError: true});
        pass.setState({hasError: true, error: 'ERROR MESSAGE'});
      }
      else {
        pass.setState({hasError: false});
      }
    }
  }

  handleSubmit(evt) {
    evt.preventDefault();

    let value = this.refs.form.getValue();

    if (value && value.tos === true) {
      let saved = clone(value);
      this.setState({value: saved});

      saved = omit(saved, 'password');
      saved = omit(saved, 'passwordCheck');
      this.props.flux.getActions('signup').submit(value);
      this.setState({submited: true});
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

  validation(errors) {
    if (!isEmpty(errors)) {
      let options = clone(this.state.options);
      options.fields = clone(options.fields);

      errors.map(function (err) {
        if (err.code === 'invalid') {
          options.fields[err.field] = clone(options.fields[err.field]);
          options.fields[err.field] = {hasError: true, error: err.message};
        }
        else {
          options.fields[err.path] = clone(options.fields[err.path]);
          options.fields[err.path] = {hasError: true, error: err.message};
        }
      });

      this.setState({options: options});
    }

    this.setState({submited: false});
  }

  checkSubmited(response) {
    if (!isEmpty(response)) {
      this.setState({submited: true});

      setTimeout(() => this.context.router.transitionTo('/'), 1000);

    }
  }

  componentWillReceiveProps(nextProps) {
    this.validation(nextProps.errors);
    this.checkSubmited(nextProps.response);
  }

  render() {

    return (
      <main className="ui two column stackable page grid">
        <div className="column">
          <div className="ui piled segment">
            <h2 className="ui header">
              <i className="users icon"></i>
              <div className="content">
                Hello folks!
                <div className="sub header">Welcome to The Zone</div>
                {this.props.response}
              </div>
            </h2>
          </div>
        </div>
        <div className="column">
          <form className="ui form segment" action="/api/v1/userstoken" method="post" onSubmit={this.handleSubmit}>
            <Form ref="form" type={SignupForm} options={this.state.options} value={this.state.value} onChange={this.handleChange} />
            <div className="ui hidden divider" />
            <button type="submit" className="ui teal labeled icon huge button" disabled={this.state.submited}>
              Register
              <i className="add icon"></i>
            </button>
          </form>
        </div>
      </main>
    );
  }
}

Signup.propTypes = {
  errors: React.PropTypes.object
};

Signup.defaultTypes = {
  errors: {}
};

Signup.contextTypes = {
  router: React.PropTypes.func.isRequired
};



export default Signup;
