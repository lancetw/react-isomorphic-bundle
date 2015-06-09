'use strict';

const models = require('src/server/db/models');
const hashids = require('src/shared/utils/hashids-plus');
const Post = models.posts;

exports.create = function *(post) {
  const fillable = ['uid', 'type', 'prop', 'start_date', 'end_date', 'open_date', 'close_date', 'title', 'content'];

  return yield Post.create(post, {fields: fillable});
};

exports.load = function *(hid) {
  const id = +hashids.decode(hid);
  return yield Post.findOne({
    where: {id: id}
  });
};

exports.update = function *(hid, post) {
  const fillable = ['type', 'prop', 'start_date', 'end_date', 'open_date', 'close_date', 'title', 'content'];
  const id = +hashids.decode(hid);
  let p = yield Post.findOne({
    where: {id: id}
  });
  return yield p.update(post, {fields: fillable});
};

exports.delete = function *(hid) {
  const id = +hashids.decode(hid);
  let post = yield Post.findOne({where: {id: id}});
  return yield post.destroy();
};

exports.updateGeo = function *(hid, geo) {
  const fillable = ['lat', 'lng', 'country', 'city', 'place', 'zipcode', 'address'];
  const id = +hashids.decode(hid);
  let p = yield Post.findOne({
    where: {id: id}
  });
  return yield p.update(geo, {fields: fillable});
};

exports.updateAttachments = function *(hid, attach) {
  const fillable = ['url', 'img', 'file'];
  const id = +hashids.decode(hid);
  let p = yield Post.findOne({
    where: {id: id}
  });
  return yield p.update(attach, {fields: fillable});
};
