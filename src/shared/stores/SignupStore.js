import {Store} from 'flummox';
import debug from 'debug';

export default class SignupStore extends Store {
  constructor({signupActions}) {
    super();

    this.state = {response: {}, errors: {}};

    this.register(signupActions.submit, this.getErrors);
    this.register(signupActions.reset, this.reset);
  }

  getErrors(errors) {
    if (!errors.token) {
      this.setState({errors: JSON.parse(errors), response: {}});
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
