import React from 'react';
import BaseComponent from 'shared/components/BaseComponent';
import {Form, Tcomb, PostForm, PostFormOptions} from 'shared/utils/forms';
import {isEmpty, clone, omit} from 'lodash';
import classNames from 'classnames';
import moment from 'moment';

class Post extends BaseComponent{
  displayName: 'Post Component'

  constructor(props, context) {
    super(props);
    const today = moment().format('YYYY-M-D').split('-');
    today[1] = today[1] - 1;
    this.state = {value: {type: '2', prop: '1', startDate: today, endDate: today, title: null, content: null}, options: PostFormOptions, submited: false, updated: false};

    this._bind('handleSubmit', 'validation', 'handleChange');
  }

  handleChange(value, path) {
  }

  handleSubmit(evt) {
    evt.preventDefault();

    let value = this.refs.form.getValue();

    if (value) {
      let saved = clone(value);
      this.setState({value: saved});

      this.props.flux.getActions('post').submit(value);
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

      if (response.id) {
        this.setState({updated: true, submited: true});
      }
      setTimeout(() => this.context.router.transitionTo('/wall'), 2000);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.validation(nextProps.errors);
    this.checkSubmited(nextProps.response);
  }

  componentDidMount() {
    var type = this.refs.form.getComponent('type');
  }

  render() {
    let Loading = this.state.submited && !this.state.updated ? classNames('ui', 'form', 'segment', 'loading') : classNames('ui', 'form', 'segment');

    let Message = this.state.updated ?
    (
      <div className="ui success message">
        <div className="header">
          Post created!
        </div>
        <p>now will redirect to homepage.</p>
      </div>
    ) : null;

    return (
      <main className="ui two column stackable centered page grid">
        <div className="column">
          {Message}
          <form className={Loading} action="/posts/new" method="post" onSubmit={this.handleSubmit}>
            <Form ref="form" type={PostForm} options={this.state.options} value={this.state.value} onChange={this.handleChange} />
            <div className="ui hidden divider" />
            <button type="submit" className="ui red labeled icon large button" disabled={this.state.submited}>
              Post it!
              <i className="add icon"></i>
            </button>
          </form>
        </div>
      </main>
    );
  }
}

Post.propTypes = {
  errors: React.PropTypes.object
};

Post.defaultTypes = {
  errors: {}
};

Post.contextTypes = {
  router: React.PropTypes.func.isRequired
};



export default Post;
