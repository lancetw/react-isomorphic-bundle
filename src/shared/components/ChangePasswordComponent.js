import React from 'react';
import BaseComponent from 'shared/components/BaseComponent';
import {Form, Tcomb, ChangePasswordForm, ChangePasswordFormOptions} from 'shared/utils/forms';
import {isEmpty, clone} from 'lodash';
import classNames from 'classnames';

const ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

class ChangePassword extends BaseComponent{
  displayName: 'Change Password Component'

  constructor(props, context) {
    super(props);
    this.state = {value: {password: '', passwordCheck: ''}, options: ChangePasswordFormOptions, submited: false, updated: false};

    this._bind('handleSubmit', 'validation', 'handleChange');
  }

  handleChange(value, path) {
    const pass = this.refs.form.getComponent('password');
    const check = this.refs.form.getComponent('passwordCheck');

    if (path[0] === 'passwordCheck') {
      if (pass.state.value !== check.state.value) {
        check.setState({hasError: true});
      }
      else {
        check.setState({hasError: false});
      }
    }

    if (path[0] === 'password') {
      if (pass.state.value.length < 6) {
        pass.setState({hasError: true});
      }
      else {
        pass.setState({hasError: false});
      }
    }
  }

  handleSubmit(evt) {
    evt.preventDefault();

    let value = this.refs.form.getValue();
    if (value && (value.password === value.passwordCheck)) {
      this.props.flux.getActions('user').changePassword(value);
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
      if (response.email) {
        this.setState({updated: true});
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    this.validation(nextProps.errors);
    this.checkSubmited(nextProps.response);
  }

  shouldComponentUpdate() {
    setTimeout(() => this.setState({updated: false, submited: false}), 6000);
    return true;
  }

  render() {
    let Loading = this.state.submited && !this.state.updated ? classNames('ui', 'form', 'segment', 'loading') : classNames('ui', 'form', 'segment');

    let Message = this.state.updated ?
    (
      <div className="ui success message">
        <div className="header">
          Your password change request was successful.
        </div>
        <p>Please use new password to login next time.</p>
      </div>
    ) : null;

    return (
      <main className="ui two column stackable centered page grid">
        <div className="column">
          <ReactCSSTransitionGroup transitionName="MessageTransition">
            {Message}
          </ReactCSSTransitionGroup>
          <form className={Loading} action="/auth/changePassword" method="post" onSubmit={this.handleSubmit}>
            <Form ref="form" type={ChangePasswordForm} options={this.state.options} value={this.state.value} onChange={this.handleChange} />
            <div className="ui hidden divider" />
            <button type="submit" className="ui blue labeled icon large button" disabled={this.state.submited}>
              Change
              <i className="add icon"></i>
            </button>
          </form>
        </div>
      </main>
    );
  }
}

ChangePassword.propTypes = {
  errors: React.PropTypes.object
};

ChangePassword.defaultTypes = {
  errors: {}
};

ChangePassword.contextTypes = {
  router: React.PropTypes.func.isRequired
};

export default ChangePassword;
