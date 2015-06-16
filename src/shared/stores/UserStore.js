import {Store} from 'flummox';
import debug from 'debug';
import {isArray} from 'lodash';

export default class UserStore extends Store {
  constructor({userActions}) {
    super();

    this.state = {errors: [], response: {}};
    this.register(userActions.changePassword, this.getErrors);
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
