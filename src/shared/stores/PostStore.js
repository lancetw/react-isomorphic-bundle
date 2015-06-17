import {Store} from 'flummox';
import debug from 'debug';
import {isArray} from 'lodash';

export default class PostStore extends Store {
  constructor({postActions}) {
    super();

    this.state = {errors: [], response: {}};
    this.register(postActions.submit, this.getErrors);
  }

  getErrors(errors) {
    if (!errors.id) {
      if (isArray(errors)) {
        this.setState({errors: errors, response: {}});
      }
      else {
        this.setState({errors: errors.errors, response: {}});
      }
    }
    else {
      this.setState({errors: [], response: errors});
    }
  }
}
