import moment from 'moment'
const models = require('src/server/db/models')
const Sequelize = models.Sequelize
const User = models.users
const Post = models.posts

/* eslint-disable camelcase */
exports.listByYearMonth = function *(year, month) {
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

  const count = yield Post.count({
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
    }
  })
  const items = yield Post.findAll({
    attributes: [
      [Sequelize.fn('COUNT', Sequelize.col('user.id')), 'count']
    ],
    include: [{
      model: User,
      attributes: ['id', 'email', 'name'],
      required: true
    }],
    group: ['user.id', 'user.email', 'user.name'],
    order: [['count', 'DESC']],
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

  const data = yield Post.findAll({
    attributes: [
      [Sequelize.fn('DATE_TRUNC', 'day', Sequelize.col('start_date')), 'day'],
      [Sequelize.fn('COUNT', '*'), 'count']
    ],
    group: ['day'],
    order: [['count', 'DESC']],
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

  return { count: count, rows: items, data: data }
}
