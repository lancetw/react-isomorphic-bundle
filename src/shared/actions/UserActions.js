import {Actions} from 'flummox';
import request from 'superagent';
import Flux from 'shared/Flux';

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
      request
        .put('/api/v1/users')
        .send(form)
        .set('Accept', 'application/json')
        .set('Authorization', 'JWT ' + token)
        .end(function (err, res) {
          console.log(err, res);
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
