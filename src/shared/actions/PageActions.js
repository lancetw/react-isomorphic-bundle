import {Actions} from 'flummox';

export default class PageActions extends Actions {

  async setTitle(title) {
    try {
      return title;
    }
    catch (err) {
      throw (err);
    }
  }

}
