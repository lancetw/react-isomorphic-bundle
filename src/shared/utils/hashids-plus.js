// ref: http://www.ajostrow.me/articles/recursive-hashids

const traverse = require('traverse')
const _ = require('lodash')
const config = require('config')
const hashids = require('hashids')(require('config').app.SALT)
const BASEID = config.app.BASEID
const SEED = config.app.SEED

exports.encode = function (id) {
  return isNaN(id) ? id : hashids.encode(id * BASEID, SEED)
}

exports.decode = function (str) {
  return !_.isString(str) ? str : +hashids.decode(str)[0] / BASEID
}

exports.encodeJson = function (object) {
  return traverse(object).map(function () {
    if (_.endsWith(this.key, 'id') && _.isNumber(this.node)) {
      return hashids.encode(this.node * BASEID, SEED)
    } else {
      return this.node
    }
  })
}

exports.decodeJson = function (object) {
  return traverse(object).map(function () {
    if (_.endsWith(this.key, 'id') &&
        _.isString(this.node) &&
        this.node.length === 8) {
      return hashids.decode(this.node)[0] / BASEID
    } else {
      return this.node
    }
  })
}
