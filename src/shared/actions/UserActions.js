import {Actions} from 'flummox';
import request from 'superagent';
import Flux from 'shared/Flux';
import jwt from 'jsonwebtoken';

export default class UserActions extends Actions {

  async changePassword(form) {
    const flux = new Flux();
    const token = flux.getStore('auth').load();
    const user = await this.update(form, token);

    // should delete client token ?
    //await flux.getActions('auth').revoke();
    return user;
  }

  async update(form, token) {
    return new Promise((resolve, reject) => {
      const user = jwt.decode(token);
      if (!user.id) reject('invalid token');
      const userId = user.id;
      request
        .put('/api/v1/users/' + userId)
        .send(form)
        .set('Accept', 'application/json')
        .set('Authorization', 'JWT ' + token)
        .send(form)
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
