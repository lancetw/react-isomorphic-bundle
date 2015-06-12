import React from 'react';
import BaseComponent from 'shared/components/BaseComponent';
import {Form, FormT, SignupForm, SignupFormOptions} from 'shared/utils/forms';
import {isEmpty, clone, omit} from 'lodash';

class Signup extends BaseComponent{
  displayName: 'Signup Component'

  constructor(props, context) {
    super(props);
    this.state = {value: {email: '', password: '', tos: false}, options: SignupFormOptions, submited: false};

    this._bind('handleSubmit', 'validation');
  }

  handleSubmit(evt) {
    evt.preventDefault();
    var value = this.refs.form.getValue();
    if (value && value.tos) {
      let saved = clone(value);
      saved = omit(saved, 'password');
      this.setState({value: saved});
      this.props.flux.getActions('signup').submit(value);
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
    }
  }

  componentWillReceiveProps(nextProps) {
    this.validation(nextProps.errors);
    this.checkSubmited(nextProps.response);
  }

  render() {
    let formClass = require('classnames')('ui', 'form', 'segment', {'error': !isEmpty(this.props.errors)});

    return (
      <main className="ui two column stackable page grid">
        <div className="column">
          <form className="ui form segment" action="/api/v1/userstoken" method="post" onSubmit={this.handleSubmit}>
            <div className="ui error message">
              <div className="header">Please correct the errors below and try again</div>
                {!isEmpty(this.props.errors) && this.props.errors.map(function (err) {
                  return <li key={err.id}>{err.message}</li>;
                })}
            </div>
            <Form ref="form" type={SignupForm} options={this.state.options} value={this.state.value} />
            <div className="ui hidden divider" />
            <button type="submit" className="ui teal labeled icon huge button" disabled={this.state.submited}>
              Register
              <i className="add icon"></i>
            </button>
          </form>
        </div>
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

export default Signup;
