
import {Flummox} from 'flummox';
import PageActions from './actions/PageActions';
import PageStore from './stores/PageStore';
import SignupActions from './actions/SignupActions';
import SignupStore from './stores/SignupStore';

export default class Flux extends Flummox {
  constructor() {
    super();

    const pageActions = this.createActions('page', PageActions);
    this.createStore('page', PageStore, {pageActions});

    const signupActions = this.createActions('signup', SignupActions);
    this.createStore('signup', SignupStore, {signupActions});
  }
}
