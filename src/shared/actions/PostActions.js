import {Actions} from 'flummox';
import request from 'superagent';
import Flux from 'shared/Flux';
import jwt from 'jsonwebtoken';
import {clone} from 'lodash';
import moment from 'moment';

export default class PostActions extends Actions {

  async submit(form) {
    const flux = new Flux();
    const token = flux.getStore('auth').load();
    const post = await this.create(form, token);
    return post;
  }

  async create(form, token) {
    return new Promise((resolve, reject) => {
      const user = jwt.decode(token);
      if (!user.id) reject('invalid token');
      const _form = clone(form);
      _form.uid = user.id;
      _form.startDate = moment(_form.startDate).format('YYYY-MM-DD');
      _form.endDate = moment(_form.endDate).format('YYYY-MM-DD');
      request
        .post('/api/v1/posts')
        .set('Accept', 'application/json')
        .set('Authorization', 'JWT ' + token)
        .send(_form)
        .end(function (err, res) {
          if (!err && res.body) {
            resolve(res.body);
          }
          else {
            reject(err);
          }
        });
    });
  }

  async list() {
    return new Promise((resolve, reject) => {
      request
        .get('/api/v1/posts')
        .set('Accept', 'application/json')
        .end(function (err, res) {
          if (!err && res.body) {
            resolve(res.body);
          }
          else {
            reject(err);
          }
        });
    });
  }

}
