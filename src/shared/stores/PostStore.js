import {Store} from 'flummox';
import debug from 'debug';
import {isArray} from 'lodash';

export default class PostStore extends Store {
  constructor({postActions}) {
    super();

    this.state = {errors: [], response: {}, posts: []};
    this.register(postActions.submit, this.setErrors);
    this.register(postActions.list, this.setList);
  }

  setErrors(errors) {
    if (!errors.id) {
      if (isArray(errors)) {
        this.setState({errors: errors, response: {}});
      }
      else {
        this.setState({errors: errors.errors, response: {}});
      }
    }
    else {
      if (isArray(errors)) {
        this.setState({errors: [], response: {}, posts: errors});
      }
      else {
        this.setState({errors: [], response: errors});
      }

    }
  }

  setList(errors) {
    if (isArray(errors)) {
      this.setState({errors: [], response: {}, posts: errors});
    }
    else {
      this.setState({errors: [], response: errors});
    }
  }
}
