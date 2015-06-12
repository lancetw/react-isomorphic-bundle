import React from 'react';
import BaseComponent from 'shared/components/BaseComponent';
import {Form, SignupForm, SignupFormOptions} from 'shared/utils/forms';
import {isEmpty, clone, omit} from 'lodash';

class Signup extends BaseComponent{
  displayName: 'Signup Component'

  constructor(props, context) {
    super(props);
    this.state = {value: {email: '', password: '', tos: false}};
    this._bind('handleSubmit');
  }

  handleSubmit(evt) {
    evt.preventDefault();
    var value = this.refs.form.getValue();
    if (value && value.tos) {
      let saved = clone(value);
      saved = omit(saved, 'password');
      this.setState({value: saved});
      this.props.flux.getActions('signup').submit(value);
    }
  }

  render() {
    let formClass = require('classnames')('ui', 'form', 'segment', {'error': !isEmpty(this.props.errors)});
    return (
      <main className="ui two column stackable page grid">
        <div className="column">
          <form className={formClass} action="/api/v1/userstoken" method="post" onSubmit={this.handleSubmit} value={this.state.value}>
            <div className="ui error message">
              <div className="header">Please correct the errors below and try again</div>
                {!isEmpty(this.props.errors) && this.props.errors.map(function (err) {
                  return <li>{err.message}</li>;
                })}
            </div>
            <Form ref="form" type={SignupForm} options={SignupFormOptions} value={this.state.value} />
            <div className="ui hidden divider" />
            <button type="submit" className="ui teal labeled icon huge button">
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
              </div>
            </h2>
          </div>
        </div>
      </main>
    );
  }
}

Signup.propTypes = {
  errors: React.PropTypes.array
};

Signup.defaultTypes = {
  errors: []
};

export default Signup;
