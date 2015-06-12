import {Store} from 'flummox';

export default class MessageStore extends Store {
  constructor({pageActions}) {
    super();

    this.baseTitle = 'Isomorphic flummox demo';
    this.delimeter = '|';
    this.state = {title: `${this.baseTitle}`};

    this.register(pageActions.setTitle, this.handleTitle);
  }

  handleTitle(title) {
    title = `${title} ${this.delimeter} ${this.baseTitle} `;

    this.setState({title: title});
  }

}
