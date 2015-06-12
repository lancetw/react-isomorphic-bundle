import {Store} from 'flummox';
import debug from 'debug';
import {isArray} from 'lodash';

export default class SignupStore extends Store {
  constructor({signupActions}) {
    super();

    this.state = {response: {}, errors: {}};

    this.register(signupActions.submit, this.getErrors);
    this.register(signupActions.reset, this.reset);
  }

  getErrors(errors) {
    if (!errors.token) {
      if (isArray(errors)) {
        this.setState({errors: errors, response: {}});
      }
      else {
        this.setState({errors: errors.errors, response: {}});
      }
    }
    else {
      // save token

      this.setState({errors: [], response: errors});
    }
  }

  reset() {
    this.setState({response: {}, error: []});
  }

}
