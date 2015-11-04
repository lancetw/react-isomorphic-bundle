import models from 'src/server/db/models'
import hashids from 'src/shared/utils/hashids-plus'
import moment from 'moment'
import {
  sortByOrder,
  uniq,
  pluck,
  range,
  compact,
  reduce,
  isEmpty,
  isFinite
} from 'lodash'

const Sequelize = models.Sequelize
const Post = models.posts
const User = models.users
const UserInfo = models.usersInfo

exports.create = function *(post) {
  const fillable = [
    'uid',
    'type',
    'prop',
    'startDate',
    'endDate',
    'openDate',
    'closeDate',
    'dateType',
    'title',
    'content',
    'file',
    'lat',
    'lng',
    'place',
    'url',
    'status',
    'ocname',
    'cid'
  ]

  return yield Post.create(post, { fields: fillable })
}

exports.load = function *(hid) {
  const id = +hashids.decode(hid)
  if (!isFinite(id)) return {}

  return yield Post.findOne({
    where: { id: id, status: 0 },
    include: [{
      model: User,
      attributes: ['name'],
      required: true,
      include: [{
        model: UserInfo,
        attributes: ['ocname', 'cid'],
        required: false
      }]
    }],
    raw: true
  })
}

/* eslint-disable camelcase */
exports.list = function *(offset=0, limit=20, mode='default') {
  if (mode === 'rss') {
    return yield Post.findAll({
      offset: offset,
      limit: limit,
      order: [[ 'id', 'DESC' ]],
      where: {
        status: 0
      },
      raw: true
    })
  } else {
    const _start = moment().startOf('day').valueOf()
    return yield Post.findAll({
      offset: offset,
      limit: limit,
      order: [[ 'start_date', 'DESC' ]],
      where: {
        end_date: {
          $gte: new Date(_start)
        },
        status: 0
      },
      raw: true
    })
  }
}

/* eslint-disable camelcase */
exports.listAllWithCount = function *(offset=0, limit=20, status=0) {
  return yield Post.findAndCountAll({
    offset: offset,
    limit: limit,
    order: [[ 'created_at', 'DESC' ], [ 'id', 'DESC' ]],
    where: {
      status: +status
    },
    attributes: ['id', 'title', 'created_at', 'status'],
    include: [{
      model: User,
      attributes: ['email'],
      required: true
    }],
    raw: true
  })
}

/* eslint-disable camelcase */
exports.listWithCprop = function *(cprop, offset=0, limit=20, nocontent=false) {
  if (!isFinite(+cprop)) return []
  if (nocontent) {
    return yield Post.findAll({
      offset: offset,
      limit: limit,
      order: [[ 'start_date', 'DESC' ]],
      attributes: ['id', 'title', 'startDate', 'prop', 'type'],
      where: {
        prop: +cprop,
        status: 0
      },
      raw: true
    })
  } else {
    return yield Post.findAll({
      offset: offset,
      limit: limit,
      order: [[ 'start_date', 'DESC' ]],
      where: {
        prop: +cprop,
        status: 0
      },
      raw: true
    })
  }
}

/* eslint-disable camelcase */
exports.listWithType = function *(type, offset=0, limit=20) {
  if (!type) return []
  if (!isFinite(+type)) return []

  return yield Post.findAll({
    offset: offset,
    limit: limit,
    order: [[ 'start_date', 'DESC' ]],
    where: {
      type: +type,
      status: 0
    },
    raw: true
  })
}

exports.listWithUser = function *(offset=0, limit=20, uid) {
  if (!uid) return []
  if (!isFinite(+uid)) return []

  return yield Post.findAll({
    offset: offset,
    limit: limit,
    order: [[ 'id', 'DESC' ]],
    where: {
      uid: +uid,
      status: 0
    },
    raw: true
  })
}

/* eslint-disable camelcase */
exports.listWithOg = function *(offset=0, limit=20, cid) {
  if (!cid) return []
  if (!isFinite(+cid)) return []

  return yield Post.findAll({
    offset: offset,
    limit: limit,
    order: [[ 'start_date', 'DESC' ], [ 'id', 'DESC' ]],
    where: {
      cid: +cid,
      status: 0
    },
    raw: true
  })
}

/* eslint-disable camelcase */
exports.fetch = function *(offset=0, limit=20, start, end) {
  let _start = start
  let _end = end

  if (!_start) {
    _start = moment().startOf('day').valueOf()
  } else {
    _start = +_start
  }
  if (!_end) {
    _end = moment(+_start).endOf('day').valueOf()
  } else {
    _end = +_end
  }

  if (!isFinite(_start)) return []
  if (!isFinite(_end)) return []

  const items = yield Post.findAll({
    offset: offset,
    limit: limit,
    order: [[ 'start_date', 'DESC' ]],
    where: {
      status: 0,
      $or: [
        {
          start_date: {
            $between: [
              new Date(moment(_start).startOf('day')),
              new Date(moment(_start).endOf('day'))
            ]
          }
        },
        {
          end_date: {
            $between: [
              new Date(moment(_end).startOf('day')),
              new Date(moment(_end).endOf('day'))
            ]
          }
        },
        {
          start_date: {
            $lt:
              new Date(moment(_start).startOf('day'))
          },
          end_date: {
            $gt:
              new Date(moment(_end).startOf('day'))
          }
        }
      ]
    },
    raw: true
  })

  return items
}

/* eslint-disable camelcase */
exports.fetchWithCount = function *(offset=0, limit=20, start, end, status=0) {
  let _start = start
  let _end = end

  if (!_start) {
    _start = moment().startOf('day').valueOf()
  } else {
    _start = +_start
  }
  if (!_end) {
    _end = moment(+_start).endOf('day').valueOf()
  } else {
    _end = +_end
  }

  if (!isFinite(_start)) return {}
  if (!isFinite(_end)) return {}
  if (!isFinite(+status)) return {}

  const items = yield Post.findAndCountAll({
    offset: offset,
    limit: limit,
    order: [[ 'created_at', 'DESC' ], [ 'id', 'DESC' ]],
    where: {
      status: +status,
      $or: [
        {
          start_date: {
            $between: [
              new Date(moment(_start).startOf('day')),
              new Date(moment(_start).endOf('day'))
            ]
          }
        },
        {
          end_date: {
            $between: [
              new Date(moment(_end).startOf('day')),
              new Date(moment(_end).endOf('day'))
            ]
          }
        },
        {
          start_date: {
            $lt:
              new Date(moment(_start).startOf('day'))
          },
          end_date: {
            $gt:
              new Date(moment(_end).startOf('day'))
          }
        }
      ]
    },
    raw: true
  })

  return items
}

/* eslint-disable camelcase */
exports.fetchWithUser = function *(offset=0, limit=20, start, end, uid) {
  if (!uid) return []
  if (!isFinite(+uid)) return []

  let _start = start
  let _end = end

  if (!_start) {
    _start = moment().startOf('day').valueOf()
  } else {
    _start = +_start
  }
  if (!_end) {
    _end = moment(+_start).endOf('day').valueOf()
  } else {
    _end = +_end
  }

  if (!isFinite(_start)) return []
  if (!isFinite(_end)) return []

  return yield Post.findAll({
    offset: offset,
    limit: limit,
    order: [[ 'id', 'DESC' ]],
    where: {
      uid: +uid,
      status: 0,
      end_date: {
        $gte: new Date(_start)
      }
    },
    raw: true
  })
}

/* eslint-disable camelcase */
exports.countPerDayInMonth = function *(year, month) {
  const out = []
  const startDateOut = []
  let _year = year
  let _month = month
  let totalDays

  if (!_year) {
    totalDays = moment().endOf('month').date()
    _year = moment().year()
    _month = moment().month() + 1
  } else {
    totalDays = moment({
      year: _year,
      month: _month - 1,
      day: 1
    }).endOf('month').date()
  }

  const startItems = yield Post.findAll({
    attributes: [
      'startDate',
      'endDate'
    ],
    order: [[ 'start_date', 'ASC' ]],
    where: {
      status: 0,
      start_date: {
        $between: [
          new Date(moment({
            year: _year,
            month: _month - 1,
            day: 1
          }).startOf('day')),
          new Date(moment({
            year: _year,
            month: _month - 1,
            day: totalDays
          }).endOf('day'))
        ]
      }
    },
    raw: true
  })

  const endItems = yield Post.findAll({
    attributes: [
      'startDate',
      'endDate'
    ],
    order: [[ 'start_date', 'ASC' ]],
    where: {
      status: 0,
      start_date: {
        $notBetween: [
          new Date(moment({
            year: _year,
            month: _month - 1,
            day: 1
          }).startOf('day')),
          new Date(moment({
            year: _year,
            month: _month - 1,
            day: totalDays
          }).endOf('day'))
        ]
      },
      end_date: {
        $between: [
          new Date(moment({
            year: _year,
            month: _month - 1,
            day: 1
          }).startOf('day')),
          new Date(moment({
            year: _year,
            month: _month - 1,
            day: totalDays
          }).endOf('day'))
        ]
      }
    },
    raw: true
  })

  const duringItems = yield Post.findAll({
    attributes: [
      'startDate',
      'endDate'
    ],
    order: [[ 'start_date', 'ASC' ]],
    where: {
      status: 0,
      start_date: {
        $lt:
          new Date(moment({
            year: _year,
            month: _month - 1,
            day: 1
          }).startOf('day'))
      },
      end_date: {
        $gt:
          new Date(moment({
            year: _year,
            month: _month - 1,
            day: totalDays
          }).endOf('day'))
      }
    },
    raw: true
  })

  startItems.forEach(item => {
    const start = moment(new Date(item.startDate)).date()
    const _diff = moment(new Date(item.endDate))
      .diff(new Date(item.startDate), 'days')

    if (_diff >= 0) {
      for (const i of range(start, start + _diff + 1)) {
        if (typeof out[i] === 'undefined') {
          out[i] = 1
        } else {
          out[i] = out[i] + 1
        }
      }
    } else {
      if (typeof out[start] === 'undefined') {
        out[start] = 1
      } else {
        out[start] = out[start] + 1
      }
    }

    startDateOut[start] = 1
  })

  endItems.forEach(item => {
    const start = 1
    const _diff = moment(new Date(item.endDate))
      .diff(moment(new Date(item.endDate)).startOf('month'), 'days')

    if (_diff >= 0) {
      for (const i of range(start, start + _diff + 1))
        if (typeof out[i] === 'undefined') {
          out[i] = 1
        } else {
          out[i] = out[i] + 1
        }
    }
  })

  duringItems.forEach(item => {
    const start = 1
    const _diff = moment({
      year: _year,
      month: _month - 1,
      day: totalDays
    })
    .diff(moment({
      year: _year,
      month: _month - 1,
      day: 1
    })
    , 'days')

    if (_diff >= 0) {
      for (const i of range(start, start + _diff + 1))
        if (typeof out[i] === 'undefined') {
          out[i] = 1
        } else {
          out[i] = out[i] + 1
        }
    }
  })

  // Total in this month
  out[0] = reduce(compact(out), (sum, n) => sum + n )

  return { count: out, countStart: startDateOut }
}

function date_format (date, fm) {
  return moment(date).format(fm)
}

exports.update = function *(hid, post) {
  const fillable = [
    'type',
    'prop',
    'startDate',
    'endDate',
    'openDate',
    'closeDate',
    'dateType',
    'title',
    'content',
    'file',
    'lat',
    'lng',
    'place',
    'url',
    'status',
    'ocname',
    'cid'
  ]
  const id = +hashids.decode(hid)
  if (!isFinite(id)) return false

  const p = yield Post.findOne({
    where: { id: id }
  })
  return yield p.update(post, { fields: fillable })
}

exports.destroy = function *(hid) {
  const id = +hashids.decode(hid)
  if (!isFinite(id)) return false
  const post = yield Post.findOne({ where: { id: id } })
  return yield post.destroy()
}

exports.updateGeo = function *(hid, geo) {
  const fillable = [
    'lat',
    'lng',
    'country',
    'city',
    'place',
    'zipcode',
    'address'
  ]
  const id = +hashids.decode(hid)
  if (!isFinite(id)) return false
  const p = yield Post.findOne({
    where: { id: id }
  })
  return yield p.update(geo, { fields: fillable })
}

/* eslint-disable camelcase */
exports.search = function *(pattern, status, offset=0, limit=20) {
  return yield Post.findAll({
    offset: offset,
    limit: limit,
    order: [[ 'start_date', 'DESC' ]],
    attributes: [
      'id',
      'title',
      'created_at',
      'startDate',
      'endDate',
      'status',
      'prop',
      'type',
      'ocname',
      'cid',
      'place',
      'lat',
      'lng'
    ],
    include: [{
      model: User,
      attributes: ['email'],
      required: true
    }],
    where: {
      status: status,
      $or: [
        {
          title: {
            $like: '%' + pattern + '%'
          }
        },
        {
          content: {
            $like: '%' + pattern + '%'
          }
        }
      ]
    },
    raw: true
  })
}

/* eslint-disable camelcase */
exports.searchWithCount = function *(pattern, status, offset=0, limit=20) {
  return yield Post.findAndCountAll({
    offset: offset,
    limit: limit,
    order: [[ 'start_date', 'DESC' ]],
    attributes: ['id', 'title', 'created_at', 'status', 'prop', 'type'],
    include: [{
      model: User,
      attributes: ['email'],
      required: true
    }],
    where: {
      status: status,
      $or: [
        {
          title: {
            $like: '%' + pattern + '%'
          }
        },
        {
          content: {
            $like: '%' + pattern + '%'
          }
        }
      ]
    },
    raw: true
  })
}
