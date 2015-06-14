import {Store} from 'flummox';
import {isEmpty} from 'lodash';
import debug from 'debug';

export default class AuthStore extends Store {
  constructor({authActions}) {
    super();

    this.state = {token: ''};
    this.register(authActions.send, this.save);
    this.register(authActions.revoke, this.reset);
    this.register(authActions.sync, this.load);
  }

  save(payload) {
    const token = payload.token;
    if (typeof localStorage !== 'undefined' && localStorage !== null) {
      localStorage.setItem('token', token);
    }

    this.setState({token: token});
  }

  load(token) {
    if (!token) {
      token = this.state.token;
    }

    if (typeof localStorage !== 'undefined' && localStorage !== null) {
      token = localStorage.getItem('token');
    }

    this.setState({token: token});

    return token;
  }

  reset() {
    if (typeof localStorage !== 'undefined' && localStorage !== null) {
      localStorage.setItem('token', '');
    }

    this.setState({token: ''});
  }

}
