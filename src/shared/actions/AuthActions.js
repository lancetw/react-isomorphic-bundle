import {Actions} from 'flummox';
import request from 'superagent';

export default class AuthActions extends Actions {

  async send(form) {
    return new Promise((resolve, reject) => {
      request
        .post('/api/v1/login')
        .set('Accept', 'application/json')
        .auth(form.email, form.password)
        .end(function (err, res) {
          if (!err) {
            resolve(res.body);
          }
          else {
            throw (err);
          }
        });
    });
  }

  async revoke(token) {
    try {
      return token;
    }
    catch (err) {
      throw (err);
    }
  }

  async sync(token) {
    try {
      return token;
    }
    catch (err) {
      throw (err);
    }
  }

  async verify(token) {
    return new Promise((resolve, reject) => {
      request
        .post('/auth/token/verify')
        .set('Accept', 'application/json')
        .send({token: token})
        .end(function (err, res) {
          resolve(res.body.response);
        });
    });
  }
}
