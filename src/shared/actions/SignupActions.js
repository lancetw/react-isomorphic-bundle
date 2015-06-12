import {Actions} from 'flummox';
import request from 'superagent';

export default class SignupActions extends Actions {

  async reset() {
    return {};
  }

  async submit(form) {
    const res = await this.sendForm(form);
    if (res.email) {
      return await this.auth(form);
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
            resolve(res.body);
          }
        });
    });
  }

  async auth(form) {
    return new Promise((resolve, reject) => {
      request
        .post('/api/v1/login')
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
