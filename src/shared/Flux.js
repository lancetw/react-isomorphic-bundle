
import {Flummox} from 'flummox';
import PageActions from './actions/PageActions';
import PageStore from './stores/PageStore';

export default class Flux extends Flummox {
  constructor() {
    super();

    const pageActions = this.createActions('page', PageActions);
    this.createStore('page', PageStore, {pageActions});

  }
}
