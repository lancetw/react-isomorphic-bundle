
import {Flummox} from 'flummox';
import PageActions from './actions/PageActions';
import PageStore from './stores/PageStore';
import SignupActions from './actions/SignupActions';
import SignupStore from './stores/SignupStore';
import AuthActions from './actions/AuthActions';
import AuthStore from './stores/AuthStore';
import UserActions from './actions/UserActions';
import UserStore from './stores/UserStore';

export default class Flux extends Flummox {
  constructor() {
    super();

    const pageActions = this.createActions('page', PageActions);
    this.createStore('page', PageStore, {pageActions});

    const signupActions = this.createActions('signup', SignupActions);
    this.createStore('signup', SignupStore, {signupActions});

    const authActions = this.createActions('auth', AuthActions);
    this.createStore('auth', AuthStore, {authActions});

    const userActions = this.createActions('user', UserActions);
    this.createStore('user', UserStore, {userActions});
  }
}
