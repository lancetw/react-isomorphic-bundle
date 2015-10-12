const bcrypt = require('co-bcrypt')
const hashids = require('src/shared/utils/hashids-plus')
const models = require('src/server/db/models')
import moment from 'moment'
import { isFinite } from 'lodash'

exports.create = function *(postId, info) {
  const fillable = [
    'postId',
    'geometry'
  ]
  if (!isFinite(+postId)) return false
  info.postId = postId
  return yield models.locations.create(info, { fields: fillable })
}

exports.createOrUpdate = function *(postId, info) {
  if (!isFinite(+postId)) return false
  const location = yield models.locations.findOne({
    where: { postId: postId }
  })

  if (!location) {
    const fillable = [
      'postId',
      'geometry'
    ]
    info.postId = postId
    return yield models.locations.create(info, { fields: fillable })
  } else {
    const fillable = [
      'geometry'
    ]
    return yield location.update(info, { fields: fillable })
  }
}

exports.destroy = function *(postId) {
  if (!isFinite(+postId)) return false
  const location = yield models.locations.findOne({ where: { postId: postId } })
  return yield location.destroy({ force: true })
}

/* eslint-disable max-len, camelcase */
exports.nearBy = function *(limit=20, pattern) {
  const { sequelize } = models
  const { dialect } = sequelize.options
  /* PostGIS only */
  if ( dialect !== 'postgres') return {}

  if (typeof pattern === 'undefined' || pattern === null) return {}
  if (!isFinite(parseFloat(pattern.lat))) return {}
  if (!isFinite(parseFloat(pattern.lng))) return {}
  if (!isFinite(parseFloat(pattern.dist))) return {}

  const status = 0
  const todayStart = moment().startOf('day').utc().format('YYYY-MM-DD HH:mm:ss.SSS Z')

  /* Thanks to http://gis.stackexchange.com/questions/41242/how-to-find-the-nearest-point-from-poi-in-postgis */
  const sql = `SELECT posts.id,
                      posts.title,
                      posts.lat,
                      posts.lng,
                      posts.start_date,
                      posts.end_date,
                      posts.open_date,
                      posts.close_date,
                      ST_Distance(geometry, poi)/1000 AS distance
               FROM locations INNER JOIN posts ON (posts.id = locations.post_id),
                    (select ST_MakePoint(${pattern.lng},${pattern.lat})::geography as poi) as poi
               WHERE ST_DWithin(geometry, poi, ${pattern.dist})
                     AND posts.end_date >= '${todayStart}'
                     AND posts.status = ${status}
               ORDER BY ST_Distance(geometry, poi)
               LIMIT ${limit};`

  return yield sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
}
