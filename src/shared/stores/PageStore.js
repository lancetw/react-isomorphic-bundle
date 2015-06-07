import {Store} from 'flummox';
import debug from 'debug';

export default class MessageStore extends Store {
  constructor({pageActions}) {
    super();

    this.baseTitle = 'Isomorphic flummox demo';
    this.delimeter = '|';
    this.state = {title: `${this.baseTitle}`};

    this.register(pageActions.setTitle, this.handleTitle);
  }

  handleTitle(title) {
    title = `${this.baseTitle} ${this.delimeter} ${title}`;

    this.setState({title: title});
  }

}
