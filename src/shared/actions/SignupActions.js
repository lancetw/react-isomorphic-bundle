import {Actions} from 'flummox';
import request from 'superagent';
import Flux from 'shared/Flux';

export default class SignupActions extends Actions {

  async reset() {
    return {};
  }

  async submit(form) {
    const flux = new Flux();
    const res = await this.sendForm(form);
    if (res.email) {
      return await flux.getActions('auth').send(form);
    }
    else {
      return res;
    }
  }

  async sendForm(form) {
    return new Promise((resolve, reject) => {
      request
        .post('/api/v1/users')
        .send(form)
        .set('Accept', 'application/json')
        .end(function (err, res) {
          if (!err) {
            resolve(res.body);
          }
          else {
            reject(err);
          }
        });
    });
  }

}
