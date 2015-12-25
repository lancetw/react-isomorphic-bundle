// ref: http://www.ajostrow.me/articles/recursive-hashids
import {
  isNumber,
  isString,
  isNaN,
  includes,
  endsWith
} from 'lodash'

const traverse = require('traverse')
const config = require('config')
const hashids = require('hashids')(require('config').app.SALT)
const BASEID = config.app.BASEID
const SEED = config.app.SEED
const IGNORELIST = ['cid']

exports.encode = function (id) {
  return isNaN(id) ? id : hashids.encode(id * BASEID, SEED)
}

exports.decode = function (str) {
  return !isString(str) ? str : +hashids.decode(str)[0] / BASEID
}

exports.encodeJson = function (obj) {
  if (typeof obj.toJSON === 'function') {
    obj = obj.toJSON()
  }

  return traverse(obj).map(function () {
    if (!includes(IGNORELIST, this.key)
        && endsWith(this.key, 'id')
        && isNumber(this.node)) {
      return hashids.encode(this.node * BASEID, SEED)
    } else {
      return this.node
    }
  })
}

exports.decodeJson = function (obj) {
  if (typeof obj.toJSON === 'function') {
    obj = obj.toJSON()
  }

  return traverse(obj).map(function () {
    if (!includes(IGNORELIST, this.key)
        && endsWith(this.key, 'id')
        && isString(this.node) &&
        this.node.length === 8) {
      return hashids.decode(this.node)[0] / BASEID
    } else {
      return this.node
    }
  })
}
