export function isPastDay (d) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return d < today
}

export function isSameDay (d1, d2) {
  d1.setHours(0, 0, 0, 0)
  d2.setHours(0, 0, 0, 0)
  return d1.getTime() === d2.getTime()
}

export function isBetween (d, d1, d2) {
  d.setHours(0, 0, 0, 0)
  d1.setHours(0, 0, 0, 0)
  d2.setHours(0, 0, 0, 0)
  return d1 < d && d < d2
}

export function toMoment (date) {
  const moment = require('moment')
  if (moment(date, 'YYYY-MM-DD HH:mm:ss ZZ').isValid()) {
    return moment(date, 'YYYY-MM-DD HH:mm:ss ZZ')
  }

  return ''
}

export function toDate (date, full) {
  const moment = require('moment')
  let format = 'YYYY-M-D'
  if (typeof full !== 'undefined' && full) format = 'YYYY-MM-DD'
  if (moment(date, 'YYYY-MM-DD HH:mm:ss ZZ').isValid()) {
    return moment(date, 'YYYY-MM-DD HH:mm:ss ZZ').format(format)
  }

  return ''
}

export function toShortDate (date) {
  const moment = require('moment')
  if (moment(date, 'YYYY-MM-DD HH:mm:ss ZZ').isValid()) {
    return moment(date, 'YYYY-MM-DD HH:mm:ss ZZ').format('MM/DD')
  }

  return moment(new Date()).format('MM/DD')
}

export function toYear (date) {
  const moment = require('moment')
  if (moment(date, 'YYYY-MM-DD HH:mm:ss ZZ').isValid()) {
    return moment(date, 'YYYY-MM-DD HH:mm:ss ZZ').format('YYYY')
  }

  return moment(new Date()).format('YYYY')
}

