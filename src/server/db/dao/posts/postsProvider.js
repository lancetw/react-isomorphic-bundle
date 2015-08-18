import models from 'src/server/db/models'
import hashids from 'src/shared/utils/hashids-plus'
import moment from 'moment'
import { sortBy, uniq, pluck, range, compact, reduce, isEmpty } from 'lodash'

const Sequelize = models.Sequelize
const Post = models.posts

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
    'status'
  ]

  return yield Post.create(post, { fields: fillable })
}

exports.load = function *(hid) {
  const id = +hashids.decode(hid)
  return yield Post.findOne({
    where: { id: id }
  })
}

/* eslint-disable camelcase */
exports.list = function *(offset=0, limit=20) {
  const _start = moment().startOf('day').valueOf()
  return yield Post.findAll({
    offset: offset,
    limit: limit,
    order: [[ 'start_date', 'ASC' ]],
    where: {
      end_date: {
        $gte: new Date(moment(_start))
      }
    }
  })
}

/* eslint-disable camelcase */
exports.listWithCprop = function *(cprop, offset=0, limit=20) {
  if (cprop === null) return []

  return yield Post.findAll({
    offset: offset,
    limit: limit,
    order: [[ 'end_date', 'DESC' ]],
    where: {
      prop: +cprop
    }
  })
}

/* eslint-disable camelcase */
exports.listWithUser = function *(offset=0, limit=20, uid) {
  if (uid === null) return []

  return yield Post.findAll({
    offset: offset,
    limit: limit,
    order: [[ 'end_date', 'DESC' ]],
    where: {
      uid: +uid
    }
  })
}

/* eslint-disable camelcase */
exports.fetch = function *(offset=0, limit=20, start, end) {
  let _start = start
  let _end = end

  if (_start !== null) {
    _start = moment().startOf('day').valueOf()
  } else {
    _start = +_start
  }
  if (_end !== null) {
    _end = moment(+_start).endOf('day').valueOf()
  } else {
    _end = +_end
  }

  const startItems = yield Post.findAll({
    offset: offset,
    limit: limit,
    order: [[ 'end_date', 'ASC' ]],
    where: {
      start_date: {
        $between: [
          new Date(moment(_start).startOf('day')),
          new Date(moment(_start).endOf('day'))
        ]
      }
    },
    raw: true
  })

  const endItems = yield Post.findAll({
    offset: offset,
    limit: limit,
    order: [[ 'end_date', 'ASC' ]],
    where: {
      end_date: {
        $between: [
          new Date(moment(_end).startOf('day')),
          new Date(moment(_end).endOf('day'))
        ]
      }
    },
    raw: true
  })

  const duringItems = yield Post.findAll({
    offset: offset,
    limit: limit,
    order: [[ 'end_date', 'ASC' ]],
    where: {
      start_date: {
        $lt:
          new Date(moment(_start).startOf('day'))
      },
      end_date: {
        $gt:
          new Date(moment(_end).startOf('day'))
      }
    },
    raw: true
  })

  let final = []
  final = final.concat(startItems)
  final = final.concat(endItems)
  final = final.concat(duringItems)
  final = uniq(final, (item, key, id) => item.id )
  final = sortBy(final, 'endDate')

  return final
}

/* eslint-disable camelcase */
exports.fetchWithUser = function *(offset=0, limit=20, start, end, uid) {
  if (!uid) return []

  let _start = start
  let _end = end

  if (_start !== null) {
    _start = moment().startOf('day').valueOf()
  } else {
    _start = +_start
  }
  if (_end !== null) {
    _end = moment(+_start).endOf('day').valueOf()
  } else {
    _end = +_end
  }

  return yield Post.findAll({
    offset: offset,
    limit: limit,
    order: [[ 'id', 'DESC' ]],
    where: {
      uid: +uid,
      end_date: {
        $gte: new Date(moment(_start))
      }
    }
  })
}

/* eslint-disable camelcase */
exports.countPerDayInMonth = function *(year, month) {
  const out = []
  const startDateOut = []
  let _year = year
  let _month = month
  let totalDays

  if (_year !== null && _month !== null) {
    totalDays = moment({
      year: _year,
      month: _month - 1,
      day: 1
    }).endOf('month').date()
  } else {
    totalDays = moment().endOf('month').date()
    _year = moment().year()
    _month = moment().month() + 1
  }

  const startItems = yield Post.findAll({
    attributes: [
      'startDate',
      'endDate'
    ],
    order: [[ 'start_date', 'ASC' ]],
    where: {
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
    'status'
  ]
  const id = +hashids.decode(hid)
  const p = yield Post.findOne({
    where: { id: id }
  })
  return yield p.update(post, { fields: fillable })
}

exports.destroy = function *(hid) {
  const id = +hashids.decode(hid)
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
  const p = yield Post.findOne({
    where: { id: id }
  })
  return yield p.update(geo, { fields: fillable })
}

exports.updateAttachments = function *(hid, attach) {
  const fillable = [ 'url', 'img', 'file' ]
  const id = +hashids.decode(hid)
  const p = yield Post.findOne({
    where: { id: id }
  })
  return yield p.update(attach, { fields: fillable })
}

/* eslint-disable camelcase */
exports.search = function *(pattern, offset=0, limit=20) {
  return yield Post.findAll({
    offset: offset,
    limit: limit,
    order: [[ 'start_date', 'ASC' ]],
    where: {
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
    }
  })
}
