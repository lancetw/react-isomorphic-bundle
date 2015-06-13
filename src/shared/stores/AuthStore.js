import {Store} from 'flummox';
import debug from 'debug';

export default class AuthStore extends Store {
  constructor({authActions}) {
    super();

    this.state = {token: null};
    this.register(authActions.send, this.save);
    this.register(authActions.setToken, this.handleToken);
    this.register(authActions.revoke, this.reset);
  }

  save(token) {
    if (typeof localStorage !== 'undefined' && localStorage !== null) {
      localStorage.setItem('token', token);
    }
    else {
      debug('*')('Save to TokenDB: not yet implemented');
    }
    this.setState({token: token});
  }

  load() {
    let token = this.state.token;
    if (typeof localStorage !== 'undefined' && localStorage !== null) {
      token = localStorage.getItem('token');
    }
    else {
      debug('*')('Load from TokenDB: not yet implemented');
    }
    this.setState({token: token});
    return token;
  }

  reset() {
    if (typeof localStorage !== 'undefined' && localStorage !== null) {
      localStorage.setItem('token', null);
    }
    else {
      debug('*')('Reset TokenDB: not yet implemented');
    }
    this.setState({token: null});
  }

  isAuthenticated() {
    if (this.state.token) {
      return true;
    }
    else {
      return false;
    }
  }

  handleToken(token) {
    debug('*')('Handle token to TokenDB: not yet implemented');
    this.setState({token: token});
  }
}
